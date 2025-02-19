import React, { createContext, Dispatch, PropsWithChildren, useContext, useMemo, useReducer } from "react";
import { Outlet, Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { Stack, Typography, Tooltip, Paper, SxProps, Theme, Box, Divider, Button, Chip } from "@mui/material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { CaseTask } from "../components/CaseTask";
import { Payout } from "./Payouts";
import { Column, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, Row, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { IdType } from "../models/IdType";
import { useAtom, useAtomValue } from "jotai";
import { expandedControllingTasks } from "../utils/dataAtoms";
import { DashboardHeader } from "./DashboardHeader";
import { columnVisibilityAtom } from "./TableSettings";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";
import { getRowGridSx, getStickySx } from "./utils";
import { GroupTabs } from "./GroupTabs";
import { EntryRow, PayoutTotals, PeriodTotals } from "./types";
import { columns } from "./TableColumns";
import { PayoutFooter } from "./PayoutFooter";
import { getEmployeeDisplayString } from "../models/Employee";


type PayrollTableContextProps = {
  state: PayrollTableState
  dispatch: Dispatch<PayrollTableAction>
}

export const PayrollTableContext = createContext<PayrollTableContextProps>(null!);

export function PayrunDashboard() {
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  return (
    <>
      <PayrunPeriodView key={payrunPeriod.id} />
      <Outlet />
    </>
  );
}

const noop = () => { };
function createRowClickHandler(row: Row<EntryRow>, state: PayrollTableState, dispatch: Dispatch<PayrollTableAction>) {
  if (row.getCanExpand()) {
    return row.getToggleExpandedHandler();
  }
  if (row.getCanSelect()) {
    return () => {
      dispatch({ type: "set_selected", id: row.original.id, selected: !state.selected[row.id] });
    };
  }
  return noop;
}


function getColumnStickySx(column: Column<EntryRow>): SxProps<Theme> {
  const pinned = column.getIsPinned();
  const sx: SxProps<Theme> = { backgroundColor: "inherit" };
  if (pinned === "left") {
    const stickySx = getStickySx(10, { left: column.getStart() })
    return {
      ...sx,
      ...stickySx
    };
  }
  if (pinned === "right") {
    const stickySx = getStickySx(10, { right: column.getAfter() });
    // if (column.getIsFirstColumn('right')) {
    return {
      ...sx,
      ...stickySx
    };
  }
  return sx;
}

function PayrunPeriodView() {
  const { payrunPeriod, previousPayrunPeriod, controllingTasks, caseValueCounts, salaryTypes } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const isOpen = payrunPeriod.periodStatus === "Open";
  const rows: Array<EntryRow> = useMemo(() => {
    return payrunPeriod.entries.map((entry, index) => ({
      ...entry,
      amount: entry.openPayout ?? 0,
      previousEntry: previousPayrunPeriod?.entries?.find(previousEntry => previousEntry.employeeId == entry.employeeId),
      controllingTasks: isOpen ? controllingTasks.get(entry.employeeId) : [],
      caseValueCount: isOpen ? caseValueCounts[index] : 0,
      salaryType: salaryTypes[index]
    }));
  }, [payrunPeriod.entries, previousPayrunPeriod?.entries, isOpen, controllingTasks, caseValueCounts]);
  const [state, dispatch] = useReducer(
    reducer,
    rows,
    createInitialState
  );

  const header = (
    <DashboardHeader index>
      <GroupTabs />
    </DashboardHeader>
  );

  const view = state.group === "Controlling" ?
    <ControllingList /> :
    <PayrunPeriodTable />

  return (
    <PayrollTableContext.Provider value={{ state, dispatch }}>
      <ContentLayout title={header}>
        {view}
      </ContentLayout>
    </PayrollTableContext.Provider>
  );
}

const emptyRows = []; // use the same instance to prevent rerenders
function PayrunPeriodTable() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const [expanded, setExpanded] = useAtom(expandedControllingTasks);
  const isOpen = payrunPeriod.periodStatus === "Open";

  const { state, dispatch } = useContext(PayrollTableContext);


  const configuredColumnVisibility = useAtomValue(columnVisibilityAtom);
  const columnVisibility: VisibilityState = { ...configuredColumnVisibility, ...state.columnVisibility }
  if (!isOpen) {
    columnVisibility.open = false;
    columnVisibility.amount = false
  }

  const table = useReactTable({
    columns: columns,
    data: state.entryStateGroups[state.group] ?? emptyRows,
    meta: {
      isOpen
    },
    state: {
      expanded,
      periodTotals: state.periodTotals,
      payoutTotals: state.payoutTotals,
      columnVisibility,
      rowSelection: state.selected,
      columnPinning: {
        left: ["identifier", "employee"],
        right: ["openPayout", "amount", "documents", "events"]
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => isOpen && hasControllingTasks(row.original),
    onExpandedChange: setExpanded,
    enableRowSelection: (row) => isOpen && isRowSelectionEnabled(row.original),
    getRowId: originalRow => originalRow.id,
  });

  const submit = useSubmit();

  const onPayout = async (valueDate: string, accountIban: string) => {
    const payouts = state.entries.filter(e => state.selected[e.id]).map(x => ({ employeeId: x.employeeId, amount: x.amount || 0 }));
    const payout: Payout = {
      // @ts-ignore
      valueDate,
      payouts,
      accountIban
    }
    const formData = new FormData();
    formData.set("payrunPeriodId", payrunPeriod.id);
    formData.set("payout", JSON.stringify(payout));
    submit(formData, { method: "post" });
  };

  const rowContainerSx = getRowGridSx(table.getVisibleLeafColumns().map(col => ({
    width: col.getSize(),
    flex: col.columnDef.meta?.flex
  })));
  const minWidth = table.getTotalSize();
  const stickyHeaderSx = getStickySx(50, { top: 0 });
  const headerSx = { ...stickyHeaderSx, ...rowContainerSx };
  return (
    <Stack>
      <Stack sx={{ overflow: "auto", height: "calc(100vh - 206px)" }}>
        <Box
          component="div"
          sx={
            {
              py: 1.125,
              ...headerSx,
              rowGap: theme => theme.spacing(0.5),
              backgroundColor: theme => theme.palette.background.default
            }
          }>
          {table.getHeaderGroups().map(headerGroup =>
            headerGroup.headers.map(header => {
              if (header.isPlaceholder)
                return <div key={header.id}></div>;
              const baseColumn = header.getLeafHeaders()[0].column;
              const alignment = baseColumn.columnDef.meta?.alignment;
              const headerTooltip = header.column.columnDef.meta?.headerTooltip;
              const context = { ...header.getContext(), t };
              const variant = headerGroup.depth !== 0 ? "h6" : undefined;
              return (
                <Cell key={header.id} tooltip={headerTooltip?.(t)} align={alignment} sx={{ ...getColumnStickySx(baseColumn), gridColumn: `span ${header.colSpan}` }}>
                  <Typography variant={variant} noWrap>
                    {flexRender(header.column.columnDef.header, context)}
                  </Typography>
                </Cell>
              );
            })
          )}
        </Box>
        {
          table.getRowModel().rows.map(row => (
            <EmployeeRow
              key={row.id}
              row={row}
              onClick={createRowClickHandler(row, state, dispatch)}
              minWidth={minWidth}
              containerSx={rowContainerSx}
              dispatch={dispatch}
            />
          ))
        }
        {
          <PayoutFooter onPayout={onPayout} minWidth={minWidth}>
            {Object.keys(state.selected).length > 0 && table.getFooterGroups().map(footerGroup => {
              if (footerGroup.depth === 0)
                return;
              return (
                <Box key={footerGroup.id} component="div" sx={{ py: 1.125, ...rowContainerSx }}>
                  {footerGroup.headers.map(footer => {
                    const alignment = footer.column.columnDef.meta?.alignment;
                    const stickySx = getColumnStickySx(footer.column);
                    const context = { ...footer.getContext(), t };
                    return (
                      <Cell key={footer.id} align={alignment} sx={stickySx}>
                        <Typography fontWeight="bold">
                          {flexRender(footer.column.columnDef.footer, context)}
                        </Typography>
                      </Cell>
                    );
                  })}
                </Box>
              );
            })}
          </PayoutFooter>
        }
      </Stack>
    </Stack >
  )
}


type DashboardRowProps = {
  row: Row<EntryRow>
  onClick?: () => void
  containerSx: SxProps<Theme>
  minWidth?: number,
  dispatch: Dispatch<PayrollTableAction>
}

function EmployeeRow({ row, onClick, containerSx, minWidth, dispatch }: DashboardRowProps) {
  const { t } = useTranslation();
  let stackSx: SxProps<Theme> = {
    userSelect: "none",
    height: 40,
    backgroundColor: (theme: Theme) => theme.palette.background.default
  };
  if (row.getCanSelect()) {
    stackSx["&:hover"] = {
      backgroundColor: (theme: Theme) => theme.palette.selection[row.getIsSelected() ? "light" : "dark"],
      cursor: "pointer"
    };
    if (row.getIsSelected()) {
      stackSx.backgroundColor = (theme: Theme) => theme.palette.selection.main;
    };
  }
  if (row.getCanExpand()) {
    stackSx["&:hover"] = {
      backgroundColor: (theme: Theme) => theme.palette.selectionAttention[row.getIsExpanded() ? "light" : "dark"],
      cursor: "pointer"
    };
    if (row.getIsExpanded()) {
      stackSx.backgroundColor = (theme: Theme) => theme.palette.selectionAttention.main;
    };
  }
  const rowSx: SxProps<Theme> = { ...stackSx, ...containerSx };
  const variant = row.getCanExpand() && row.getIsExpanded() ? "outlined" : undefined;
  const visibleCells = row.getVisibleCells();
  return (
    <Stack component={Paper} elevation={0} variant={variant} sx={{ transition: "none", minWidth }}>
      <Box component="div" sx={rowSx} onClick={onClick}>
        {visibleCells.map((cell) => {
          const { tooltip, alignment } = (cell.column.columnDef.meta || {});
          const cellContext = cell.getContext();
          const stickySx = getColumnStickySx(cell.column);
          return (
            <Cell key={cell.id} tooltip={tooltip?.(cellContext, t)} align={alignment} sx={stickySx}>
              {flexRender(cell.column.columnDef.cell, { ...cellContext, dispatch, t })}
            </Cell>
          );
        })}
      </Box>
      {row.getIsExpanded() &&
        <>
          {row.original.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={row.original.employeeId} type="P" stackSx={caseTaskSx} />)}
        </>
      }
    </Stack >
  );
}

const caseTaskSx = getStickySx(10, { left: 0 });

type CellProps = {
  tooltip?: string | null | undefined
  color?: string
  align?: "left" | "center" | "right"
  sx?: SxProps<Theme>
} & PropsWithChildren

function Cell({ color, align, tooltip, sx, children }: CellProps) {
  return (
    <Tooltip title={tooltip} followCursor>
      <Box display="flex" color={color} justifyContent={align} alignItems="center" gap={0.5} minWidth={0} px={0.5} sx={sx}>
        {children}
      </Box>
    </Tooltip>
  );
}

export type TableGroup = "Controlling" | "Payable" | "PaidOut" | "Calculating" | "WithoutOccupation";

export type PayrollTableState = {
  entries: Array<EntryRow>
  entryStateGroups: Record<string, Array<EntryRow>>
  group: TableGroup
  rowFilter: string | null
  selected: RowSelectionState
  expanded: ExpandedState
  columnVisibility: VisibilityState
  payoutTotals: PayoutTotals
  periodTotals: PeriodTotals
}

export type PayrollTableAction = {
  type: "set_filter"
  filter: string | null
} | {
  type: "set_group"
  group: TableGroup
} | {
  type: "set_selected"
  id: IdType
  selected: boolean
} | {
  type: "select_all"
} | {
  type: "set_amount"
  id: IdType
  amount: number
} | {
  type: "toggle_expanded"
  id: IdType
}

function reducer(state: PayrollTableState, action: PayrollTableAction): PayrollTableState {
  function applyAction(): PayrollTableState {
    switch (action.type) {
      case "set_filter":
        if (state.rowFilter === action.filter) {
          return state;
        }
        const entries = action.filter === null ? state.entries : state.entries.filter(e => e.salaryType === action.filter);
        const groups = groupRows(entries);
        return {
          ...state,
          rowFilter: action.filter,
          entryStateGroups: groups,
          selected: state.group === "Payable" ? getSelectedState(groups["Payable"]) : state.selected,
          periodTotals: getPeriodTotals(groups["Payable"])
        };
      case "set_group": {
        if (action.group === state.group) {
          return state;
        }
        const rows = state.entryStateGroups[action.group];
        return {
          ...state,
          group: action.group,
          selected: {},
          periodTotals: getPeriodTotals(rows)
        }
      }
      case "set_selected":
        const selected = {
          ...state.selected,
          [action.id]: action.selected
        };
        return {
          ...state,
          selected: selected,
        };
      case "select_all":
        if (state.group !== "Payable")
          return state;
        return {
          ...state,
          selected: getSelectedState(state.entryStateGroups["Payable"]),
        };
      case "set_amount":
        const employee = state.entries.find(e => e.id === action.id);
        if (employee) {
          employee.amount = action.amount;
        }
        return { ...state };
      case "toggle_expanded":
        return {
          ...state,
          expanded: { [action.id]: !state.expanded[action.id] }
        }
    }
  }
  let stateAfterAction = applyAction();
  stateAfterAction.payoutTotals = getPayoutTotals(stateAfterAction.entries, stateAfterAction.selected);
  const isPayingOut = stateAfterAction.group === "Payable" && stateAfterAction.payoutTotals.payingOut > 0;
  stateAfterAction.columnVisibility = !isPayingOut ? { "amount": false } : {
    "documents": false,
    "events": false
  }
  return stateAfterAction;
}

function getSelectedState(rows: Array<EntryRow>): RowSelectionState {
  if (!rows)
    return {};
  return Object.fromEntries(rows.map(r => [r.id, true]));
}
function getPayoutTotals(entries: Array<EntryRow>, selected: RowSelectionState) {
  let totals = {
    open: 0,
    payingOut: 0
  }

  for (let entry of entries) {
    if (!selected[entry.id])
      continue;
    totals.open += entry?.openPayout ?? 0;
    totals.payingOut += entry.amount ?? 0;
  }
  return totals;
}

function getPeriodTotals(entries: Array<EntryRow>): PeriodTotals {
  let totals = {
    employees: 0,
    previousGross: 0,
    gross: 0,
    net: 0,
    open: 0,
    employerCost: 0
  };
  if (!Array.isArray(entries)) {
    return totals;
  }

  for (let entry of entries) {
    totals.previousGross += entry.previousEntry?.grossWage ?? 0;
    totals.gross += entry?.grossWage ?? 0;
    totals.net += entry?.netWage ?? 0;
    totals.open += entry?.openPayout ?? 0;
    totals.employerCost += entry?.employerCost ?? 0;
  }
  return totals;
}

function createInitialState(employeeRows: Array<EntryRow>): PayrollTableState {
  return {
    entries: employeeRows,
    entryStateGroups: groupRows(employeeRows),
    rowFilter: null,
    selected: {},
    expanded: {},
    group: "Controlling",
    columnVisibility: {
      "amount": false
    },
    payoutTotals: {
      open: 0,
      payingOut: 0
    },
    periodTotals: {
      employees: 0,
      previousGross: 0,
      gross: 0,
      net: 0,
      open: 0,
      employerCost: 0
    }
  };
}

const hasControllingTasks = (entry: EntryRow) => (entry.controllingTasks?.length ?? 0) > 0;
const hasOpenAmount = (entry: EntryRow) => ((entry.netWage ?? 0) - (entry.paidOut ?? 0)) > 0;
const isRowSelectionEnabled = (row: EntryRow) => !hasControllingTasks(row) && hasOpenAmount(row);

function groupRows(rows: Array<EntryRow>): Record<TableGroup, Array<EntryRow>> {
  return Object.groupBy(rows, groupingFn);
  function groupingFn(row: EntryRow): TableGroup {
    if (!row.payrunJobId) {
      return "Calculating";
    }
    if ((row.controllingTasks?.length ?? 0) > 0) {
      return "Controlling";
    }
    if (!!row.openPayout) {
      return "Payable";
    }
    if (row.openPayout === 0 && ((row.netWage ?? 0) > 0) && ((row.grossWage ?? 0) > 0)) {
      return "PaidOut";
    }
    return "WithoutOccupation";
  }
}


function ControllingList() {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  const wageControlling = state.entryStateGroups["Controlling"];
  const withoutOccupation = state.entryStateGroups["WithoutOccupation"];
  if (!wageControlling && !withoutOccupation) {
    return <Typography>{t("All entries are ok.")}</Typography>
  }

  return (
    <Stack spacing={2}>
      <WageControllingList wageControlling={wageControlling} />
      <WithoutOccupationList withoutOccupation={withoutOccupation} />
    </Stack>
  )
}

function WageControllingList({ wageControlling }: { wageControlling: Array<EntryRow> }) {
  const { t } = useTranslation();
  if (!wageControlling)
    return;

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t("payrun_period_wage_controlling")}</Typography>
      {wageControlling.map(entry => <ControllingRow key={entry.id} entry={entry} />)}
    </Stack>
  )
}

function ControllingRow({ entry }: { entry: EntryRow }) {
  return (
    <Stack spacing={0.5}>
      <Typography>{getEmployeeDisplayString(entry)}</Typography>
      <Stack direction="row">
        {
          entry?.controllingTasks?.map(task => <Button key={task.id} component={Link} to={`employees/${entry.employeeId}/new/${encodeURIComponent(task.name)}`} variant="outlined" color="warning" size="small">{task.displayName}</Button>)
        }
      </Stack>
    </Stack>
  )
}

function WithoutOccupationList({ withoutOccupation }: { withoutOccupation: Array<EntryRow> }) {
  const { t } = useTranslation();
  if (!withoutOccupation)
    return;

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{t("payrun_period_without_occupation")}</Typography>
      <Stack direction="row" spacing={0.5}>
        {withoutOccupation.map(entry => <Chip key={entry.id} label={getEmployeeDisplayString(entry)} variant="outlined" />)}
      </Stack>
    </Stack>
  )
}
