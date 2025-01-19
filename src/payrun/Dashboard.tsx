import React, { Dispatch, Fragment, MouseEventHandler, PropsWithChildren, useMemo, useReducer } from "react";
import { Link, Outlet, useRouteLoaderData, useSubmit } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip, Paper, SxProps, Theme, Chip, Box, TextField, Divider, Button } from "@mui/material";
import { FilterList, TrendingDown, TrendingUp } from "@mui/icons-material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { CaseTask } from "../components/CaseTask";
import { Employee } from "../models/Employee";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { PayrunPeriodEntry } from "../models/PayrunPeriod";
import { Payout } from "./Payouts";
import { CellContext, Column, createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, Row, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { AvailableCase } from "../models/AvailableCase";
import { IdType } from "../models/IdType";
import { NumericFormat } from "react-number-format";
import { useAtom, useAtomValue } from "jotai";
import { expandedControllingTasks } from "../utils/dataAtoms";
import { DashboardHeader } from "./DashboardHeader";
import { columnVisibilityAtom, TableSettingsButton } from "./TableSettings";
import { PayoutDialog } from "./PayoutDialog";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";
import { formatValue, getRowGridSx, groupSeparator } from "./utils";
import { useOpenAmountDetails } from "./useOpenAmountDetails";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    alignment?: "left" | "center" | "right",
    flex?: number,
    tooltip?: (context: CellContext<TData, TValue>, t: TFunction<"translation", undefined>) => string | null,
    headerTooltip?: (t: TFunction<"translation", undefined>) => string | null
  }
  interface CellContext<TData, TValue> {
    dispatch: Dispatch<Action>
    t: TFunction<"translation", undefined>
  }
  interface HeaderContext<TData, TValue> {
    t: TFunction<"translation", undefined>
  }

  interface TableMeta<TData> {
    isOpen: boolean
  }

  interface TableState {
    periodTotals: PeriodTotals
    payoutTotals: PayoutTotals
  }
}


export function PayrunDashboard() {
  return (
    <>
      <ContentLayout title={<DashboardHeader backlinkPath=".." />}>
        <PayrunPeriodTable />
      </ContentLayout>
      <Outlet />
    </>
  );
}

const chipSx = {
  "& .MuiChip-label": {
    display: "none"
  },
  "& .MuiChip-icon": {
    ml: 0.75,
    mr: 0.625
  }
}

const stopPropagation: MouseEventHandler = (event) => event?.stopPropagation();
const columnHelper = createColumnHelper<EntryRow>();

function getWageTypeTooltipForPreviousValue(t: TFunction<"translation", undefined>, wageType: string, context: CellContext<EntryRow, number | null>, previousValueColumnName: string | undefined = undefined) {
  if (!context.table.options.meta?.isOpen)
    return null;
  if (previousValueColumnName && context.table.getState().columnVisibility[previousValueColumnName])
    return null;
  const previousValue = formatValue(context.row.original.previousEntry?.[wageType]);
  return `${t("Value from previous period")} ${previousValue ?? "-"}`;
}

type PeriodTotals = {
  employees: number
  gross: number
  previousGross: number
  net: number
  employerCost: number
  open: number
}

function createColumns() {
  return [
    columnHelper.group({
      id: "employeeTotal",
      header: ({ table, t }) => `${table.getRowCount()} ${t("Employees")}`,
      columns: [
        columnHelper.accessor("identifier",
          {
            id: "identifier",
            cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
            header: ({ t }) => t("Id"),
            footer: ({ t }) => t("Total"),
            size: 150,
            meta: {
              flex: 1,
              tooltip: (context) => !context.table.getState().columnVisibility.employee ? context.row.original.name : null
            }
          }),
        columnHelper.accessor(row => `${row.lastName} ${row.firstName}`,
          {
            id: "employee",
            cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
            header: ({ t }) => t("Name"),
            footer: ({ table, t }) => !table.getState().columnVisibility.identifier ? t("Total") : null,
            size: 150,
            meta: {
              flex: 1,
              tooltip: (context) => !context.table.getState().columnVisibility.identifier ? context.row.original.identifier : null
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "employerCostTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.employerCost),
      columns: [
        columnHelper.accessor("entry.employerCost",
          {
            id: "employerCost",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Total cost"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "employerCost", context),
              headerTooltip: t => t("Gross wage plus employer cost")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "previousGrossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.previousGross),
      columns: [
        columnHelper.accessor("previousEntry.grossWage",
          {
            id: "grossPreviousPeriod",
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Gross PP"),
            size: 110,
            meta: {
              alignment: "right",
              headerTooltip: t => t("Difference gross to previous period")
            }
          }),
      ]
    }),
    columnHelper.accessor(row => formatValue((row.entry?.grossWage ?? 0) - (row.previousEntry?.grossWage ?? 0)),
      {
        id: "grossDiff",
        cell: (props) => <Typography noWrap>{props.getValue()}</Typography>,
        header: ({ t }) => t("Diff. gross"),
        size: 110,
        meta: {
          alignment: "right",
          headerTooltip: t => t("Difference gross to previous period")
        }
      }),
    columnHelper.group({
      id: "grossWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.gross),
      columns: [
        columnHelper.accessor("entry.grossWage",
          {
            cell: (props) => {
              const { entry, previousEntry } = props.row.original;
              const wage = entry?.["grossWage"];
              const previousWage = previousEntry?.["grossWage"];
              const isOpen = props.table.options.meta?.isOpen;
              if (!isOpen || !wage || wage === previousWage) {
                // no highlight
                return <Typography noWrap>{formatValue(props.getValue())}</Typography>
              }
              const trendingUp = !previousWage || (wage > previousWage);

              const Icon = trendingUp ? TrendingUp : TrendingDown;
              const color = trendingUp ? "green" : "red";
              return (
                <>
                  <Icon fontSize="small" htmlColor={color} />
                  <Typography noWrap color={color}>{formatValue(props.getValue())}</Typography>
                </>
              )
            },
            header: ({ t }) => t("Gross"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "grossWage", context, "grossPreviousPeriod")
            }
          }),
      ]
    }),
    columnHelper.group({
      id: "netWageTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.net),
      columns: [
        columnHelper.accessor("entry.netWage",
          {
            cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
            header: ({ t }) => t("Net"),
            size: 110,
            meta: {
              alignment: "right",
              tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "netWage", context)
            }
          }),
      ]
    }),
    columnHelper.accessor("entry.offsetting",
      {
        id: "offsetting",
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("OT"),
        size: 110,
        meta: {
          alignment: "right",
          tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "offsetting", context),
          headerTooltip: t => t("Offsetting")
        }
      }),
    columnHelper.accessor("entry.retro",
      {
        id: "retro",
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("Retro"),
        size: 110,
        meta: {
          alignment: "right",
          tooltip: (context, t) => getWageTypeTooltipForPreviousValue(t, "retro", context)
        }
      }),
    columnHelper.accessor("entry.openGarnishmentPayoutPreviousPeriod",
      {
        id: "openGarnishmentPayoutPreviousPeriod",
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("GPP"),
        size: 110,
        meta: {
          alignment: "right",
          headerTooltip: t => t("Garnishment from previous period")
        }
      }),
    columnHelper.accessor("entry.openWagePayoutPreviousPeriod",
      {
        id: "openWagePayoutPreviousPeriod",
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("OPP"),
        size: 110,
        meta: {
          alignment: "right",
          headerTooltip: t => t("Open from previous period")
        }
      }),
    columnHelper.accessor("entry.paidOut",
      {
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("Paid"),
        size: 110,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor("entry.garnishment",
      {
        id: "garnishment",
        cell: (props) => <Typography noWrap>{formatValue(props.getValue())}</Typography>,
        header: ({ t }) => t("Garnishment"),
        size: 110,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.group({
      id: "openTotal",
      header: ({ table }) => formatValue(table.getState().periodTotals.open),
      columns: [
        columnHelper.accessor("entry.openPayout",
          {
            id: "openPayout",
            cell: context => {
              const { hasDetails, popover, openPopover, closePopover } = useOpenAmountDetails(context);
              let value = formatValue(context.getValue());
              if (value !== null) {
                value = value + (hasDetails ? "*" : "")
              }
              return (
                <>
                  <Typography onMouseOver={openPopover} onMouseLeave={closePopover}>{value}</Typography>
                  {popover}
                </>
              )
            },
            header: ({ t }) => t("Open"),
            footer: (props) => formatValue(props.table.getState().payoutTotals.open),
            size: 110,
            meta: {
              alignment: "right"
            }
          }),
      ]
    }),
    columnHelper.accessor("amount",
      {
        id: "amount",
        cell: function({ row, dispatch }) {
          if (row.getCanExpand()) {
            return;
          }
          const onClick: MouseEventHandler = (event) => {
            if (row.getIsSelected()) {
              event.stopPropagation();
            }
          }
          return <AmountInput employee={row.original} dispatch={dispatch} onClick={onClick} />;
        },
        header: ({ t }) => t("dashboard_payout_header"),
        footer: (props) => formatValue(props.table.getState().payoutTotals.payingOut),
        size: 110,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.display({
      id: "documents",
      cell: (props) => {
        const payrunEntry = props.row.original.entry;
        return (
          <Stack direction="row" sx={{ width: 35, justifyContent: "end" }}>
            {
              payrunEntry?.documents?.filter(doc => doc.attributes?.type === "payslip").map(doc => (
                <Tooltip key={doc.id} title={doc.name} placement="left">
                  <IconButton size="small" component={Link} to={`${payrunEntry.id}/doc/${doc.id}`} onClick={stopPropagation}><FilePresentRoundedIcon /></IconButton>
                </Tooltip>
              ))
            }
          </Stack>
        )
      },
      size: 55,
      meta: {
        alignment: "center"
      }
    }),
    columnHelper.display({
      id: "events",
      cell: ({ row, t }) => {
        const { entry, caseValueCount } = row.original;
        if (!entry || caseValueCount === 0)
          return <div></div>;
        return (
          <Stack direction="row" sx={{ width: 35, justifyContent: "end" }}>
            <Tooltip title={t("Events")} placement="left">
              <IconButton size="small" component={Link} to={`employees/${entry.employeeId}/events`} onClick={stopPropagation}><WorkHistoryOutlinedIcon /></IconButton>
            </Tooltip>
          </Stack>
        )
      },
      header: _ => <TableSettingsButton />,
      size: 55,
      meta: {
        alignment: "center"
      }
    })
  ];
}

const columns = createColumns();


export type EntryRow = Employee & {
  name: string
  entry: PayrunPeriodEntry | undefined
  previousEntry: PayrunPeriodEntry | undefined
  amount: number | undefined
  controllingTasks: Array<AvailableCase> | undefined
  caseValueCount: number
}

function getFilteredEmployees(employees: Array<EntryRow>, type: "ML" | "SL" | "Payable") {
  if (type === "Payable") {
    return employees.filter(e => ((e.entry?.openPayout ?? 0) > 0) && (e.controllingTasks?.length ?? 0) === 0);
  }
  const predicate = (_: any, i: number) => [1, 3, 5, 6, employees.length - 1].includes(i);
  const inverted = (_: any, i: number) => !predicate(_, i);
  const filterPredicate = type === "SL" ? predicate : inverted;
  return employees.filter(filterPredicate);
}


const noop = () => { };
function createRowClickHandler(row: Row<EntryRow>, state: State, dispatch: Dispatch<Action>) {
  if (row.getCanExpand()) {
    return row.getToggleExpandedHandler();
  }
  if (row.getCanSelect()) {
    return () => {
      dispatch({ type: "set_selected", id: row.id, selected: !state.selected[row.id] });
    };
  }
  return noop;
}


function getColumnStickySx(column: Column<EntryRow>): SxProps<Theme> {
  const pinned = column.getIsPinned();
  const sx: SxProps<Theme> = { backgroundColor: "inherit" };
  if (pinned === "left") {
    const stickySx = getStickySx(10, { left: column.getStart() })
    // if (column.getIsLastColumn('left')) {
    //   console.log("last column left");
    //   return {
    //     borderRightStyle: "solid",
    //     borderRightWidth: "thin",
    //     borderRightColor: (theme) => theme.palette.divider,
    //     ...stickySx
    //   };
    // }
    return {
      ...sx,
      ...stickySx
    };
  }
  if (pinned === "right") {
    const stickySx = getStickySx(10, { right: column.getAfter() });
    // if (column.getIsFirstColumn('right')) {
    //   return {
    //     borderLeftStyle: "solid",
    //     borderLeftWidth: "thin",
    //     borderLeftColor: (theme) => theme.palette.divider,
    //     ...stickySx
    //   };
    // }
    return {
      ...sx,
      ...stickySx
    };
  }
  return sx;
}

function getStickySx(priority: number, position: { top?: number, bottom?: number, left?: number, right?: number }): SxProps<Theme> {
  return {
    ...position,
    position: "sticky",
    zIndex: priority
  }
}

function PayrunPeriodTable() {
  const { t } = useTranslation();
  const { employees, payrunPeriod, previousPayrunPeriod, controllingTasks, caseValueCounts } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const [expanded, setExpanded] = useAtom(expandedControllingTasks);
  const isOpen = payrunPeriod.periodStatus === "Open";
  const employeeRows: Array<EntryRow> = useMemo(() => {
    function mapEmployee(employee: Employee, index: number): EntryRow {
      const entry = payrunPeriod?.entries?.find(entry => entry.employeeId === employee.id);
      const open = entry?.openPayout ?? 0;
      return {
        ...employee,
        entry,
        name: `${employee.firstName} ${employee.lastName}`,
        amount: open,
        previousEntry: previousPayrunPeriod?.entries?.find(entry => entry.employeeId == employee.id),
        controllingTasks: isOpen ? controllingTasks[index] : [],
        caseValueCount: isOpen ? caseValueCounts[index] : 0
      }
    }
    return employees.map(mapEmployee);
  }, [employees, payrunPeriod?.entries]);

  const periodTotals: PeriodTotals = useMemo(() => {
    let totals = {
      employees: employees.length,
      previousGross: 0,
      gross: 0,
      net: 0,
      open: 0,
      employerCost: 0
    };

    for (let employee of employeeRows) {
      const entry = employee.entry;
      totals.previousGross += employee.previousEntry?.grossWage ?? 0;
      totals.gross += entry?.grossWage ?? 0;
      totals.net += entry?.netWage ?? 0;
      totals.open += entry?.openPayout ?? 0;
      totals.employerCost += entry?.employerCost ?? 0;
    }
    return totals;
  }, [employeeRows, payrunPeriod?.entries])


  const [state, dispatch] = useReducer(
    reducer,
    employeeRows,
    createInitialState
  );
  const { filtered, filter: mode } = state;
  const configuredColumnVisibility = useAtomValue(columnVisibilityAtom);
  const columnVisibility: VisibilityState = { ...configuredColumnVisibility, ...state.columnVisibility }
  if (!isOpen) {
    columnVisibility.open = false;
    columnVisibility.amount = false
  }
  const table = useReactTable({
    columns: columns,
    data: filtered,
    meta: {
      isOpen
    },
    state: {
      expanded,
      periodTotals,
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
    const payouts = state.employees.filter(e => state.selected[e.id]).map(x => ({ employeeId: x.id, amount: x.amount || 0 }));
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
      <Stack direction="row" spacing={2} flex={1} sx={{ pr: 0.5 }} alignItems="center">
        <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33 }}>
          <Chip icon={<FilterList />} variant={mode === "Payable" ? "filled" : "outlined"} sx={chipSx} onClick={() => { dispatch({ type: "toggle_mode", mode: "Payable" }) }} color="primary" />
          <Chip label="SL" variant={mode === "SL" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "SL" }) }} color="primary" />
          <Chip label="ML" variant={mode === "ML" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "ML" }) }} color="primary" />
        </Stack>
      </Stack>
      <Stack sx={{ overflow: "auto", height: "calc(100vh - 206px)" }}>
        {table.getHeaderGroups().map(headerGroup => (
          <Box
            key={headerGroup.id}
            component="div"
            sx={
              {
                py: 1.125,
                ...headerSx,
                backgroundColor: theme => theme.palette.background.default
              }
            }>
            {headerGroup.headers.map(header => {
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
            })}
          </Box>
        ))}
        {
          isOpen ?
            groupRows(table.getRowModel().rows).map(group => (
              <Fragment key={group.name}>
                <Divider textAlign="left" sx={{ ...getStickySx(30, { top: 45, left: 0, right: 0 }), backgroundColor: theme => theme.palette.background.default }}>{t(group.name)}</Divider>
                {group.rows.map(row =>
                  <EmployeeRow
                    key={row.id}
                    row={row}
                    onClick={createRowClickHandler(row, state, dispatch)}
                    minWidth={minWidth}
                    containerSx={rowContainerSx}
                    dispatch={dispatch}
                  />)}
              </Fragment>
            ))
            :
            table.getRowModel().rows.map(row => (
              <EmployeeRow
                key={row.id}
                row={row}
                minWidth={minWidth}
                containerSx={rowContainerSx}
                dispatch={dispatch}
              />
            ))
        }
        {
          periodTotals.open > 0 && (state.mode === "payout") &&
          <PayoutFooter employeeCount={Object.values(state.selected).filter(Boolean).length} totalPayingOut={state.payoutTotals.payingOut} onPayout={onPayout} minWidth={minWidth}>
            {table.getFooterGroups().map(footerGroup => {
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

type PayoutFooterProps = {
  employeeCount: number
  totalPayingOut: number
  onPayout: (valutaDate: string, accountIban: string) => void,
  minWidth?: number
} & PropsWithChildren

function PayoutFooter({ employeeCount, totalPayingOut, onPayout, minWidth, children }: PayoutFooterProps) {
  const { t } = useTranslation();
  return (
    <Stack
      spacing={2}
      sx={{
        minWidth,
        ...getStickySx(40, { bottom: 0 }),
        py: 2,
        borderTop: 1,
        borderColor: theme => theme.palette.divider,
        backgroundColor: theme => theme.palette.background.default
      }}
    >
      {children}
      <Stack direction="row" justifyContent="end">
        <PayoutDialog
          amount={totalPayingOut}
          employeeCount={employeeCount}
          onPayout={onPayout}>
          <Button variant="contained" disabled={totalPayingOut === 0} sx={getStickySx(40, { right: 0 })}>
            <Stack direction="row">
              <span>{t("Payout")}:&nbsp;</span>
              <span>{formatValue(totalPayingOut)}</span>
              <span>&nbsp;CHF</span>
            </Stack>
          </Button>
        </PayoutDialog>
      </Stack>
    </Stack>
  )
}

type RowGroup = {
  name: string
  rows: Array<Row<EntryRow>>
}

function groupRows(rows: Array<Row<EntryRow>>): Array<RowGroup> {
  function groupingFn(row: Row<EntryRow>) {
    if (!row.original.entry?.payrunJobId) {
      return "payrun_period_calculating";
    }
    if ((row.original.controllingTasks?.length ?? 0) > 0) {
      return "payrun_period_controlling";
    }
    if (!!row.original.entry?.openPayout) {
      return "payrun_period_ready";
    }
    if (row.original.entry?.openPayout === 0 && ((row.original.entry?.netWage ?? 0) > 0) && ((row.original.entry?.grossWage ?? 0) > 0)) {
      return "payrun_period_paid_out";
    }
    return "payrun_period_without_occupation";
  }
  const grouping = Object.groupBy(rows, groupingFn) as Record<string, Array<Row<EntryRow>>>;
  const result: Array<RowGroup> = [];
  if (grouping["payrun_period_calculating"]) {
    result.push({ name: "payrun_period_calculating", rows: grouping["payrun_period_calculating"] });
  }
  if (grouping["payrun_period_controlling"]) {
    result.push({ name: "payrun_period_controlling", rows: grouping["payrun_period_controlling"] });
  }
  if (grouping["payrun_period_ready"]) {
    result.push({ name: "payrun_period_ready", rows: grouping["payrun_period_ready"] });
  }
  if (grouping["payrun_period_paid_out"]) {
    result.push({ name: "payrun_period_paid_out", rows: grouping["payrun_period_paid_out"] });
  }
  if (grouping["payrun_period_without_occupation"]) {
    result.push({ name: "payrun_period_without_occupation", rows: grouping["payrun_period_without_occupation"] });
  }
  return result;
}



type DashboardRowProps = {
  row: Row<EntryRow>
  onClick?: () => void
  containerSx: SxProps<Theme>
  minWidth?: number,
  dispatch: Dispatch<Action>
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
  const elevation = row.getCanExpand() && row.getIsExpanded() ? 1 : 0;
  const visibleCells = row.getVisibleCells();
  return (
    <Stack component={Paper} elevation={elevation} sx={{ transition: "none", minWidth }}>
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
          {row.original.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={row.original.id} type="P" stackSx={caseTaskSx} />)}
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
    <Tooltip title={tooltip}>
      <Box display="flex" color={color} justifyContent={align} alignItems="center" gap={0.5} minWidth={0} px={0.5} sx={sx}>
        {children}
      </Box>
    </Tooltip>
  );
}

type FilterMode = "All" | "ML" | "SL" | "Payable";

type PayoutTotals = {
  open: number
  payingOut: number
}

type State = {
  employees: Array<EntryRow>
  filtered: Array<EntryRow>
  selected: RowSelectionState
  expanded: ExpandedState
  columnVisibility: VisibilityState
  filter: FilterMode
  mode: "view" | "payout"
  payoutTotals: PayoutTotals
}

type Action = {
  type: "reset_mode"
} | {
  type: "toggle_mode"
  mode: "ML" | "SL" | "Payable"
} | {
  type: "set_selected"
  id: IdType
  selected: boolean
} | {
  type: "set_amount"
  id: IdType
  amount: number
} | {
  type: "toggle_expanded"
  id: IdType
}

function reducer(state: State, action: Action): State {
  const resetState = (): State => ({
    ...state,
    filtered: state.employees,
    selected: {},
    expanded: {},
    filter: "All"
  });

  function applyAction() {
    switch (action.type) {
      case "reset_mode":
        return resetState();
      case "toggle_mode": {
        if (action.mode === state.filter) {
          return resetState();
        }
        const employees = getFilteredEmployees(state.employees, action.mode);
        const selected: RowSelectionState = Object.fromEntries(
          employees.map(e => ([e.id, isRowSelectionEnabled(e)]))
        );
        return {
          ...state,
          selected,
          filtered: employees,
          filter: action.mode,
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
      case "set_amount":
        const employee = state.employees.find(e => e.id === action.id);
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
  stateAfterAction.payoutTotals = getPayoutTotals(stateAfterAction.employees, stateAfterAction.selected);
  stateAfterAction.mode = Object.values(stateAfterAction.selected).some(s => s) ? "payout" : "view";
  stateAfterAction.columnVisibility = stateAfterAction.mode === "view" ? { "amount": false } : {
    "documents": false,
    "events": false
  }
  return stateAfterAction;
}

function getPayoutTotals(employees: Array<EntryRow>, selected: RowSelectionState) {
  let totals = {
    open: 0,
    payingOut: 0
  }

  for (let employee of employees) {
    if (!selected[employee.id])
      continue;
    const entry = employee.entry;
    totals.open += entry?.openPayout ?? 0;
    totals.payingOut += employee.amount ?? 0;
  }
  return totals;
}

function createInitialState(employeeRows: Array<EntryRow>): State {
  return {
    employees: employeeRows,
    filtered: employeeRows,
    selected: {},
    expanded: {},
    filter: "All",
    mode: "view",
    columnVisibility: {
      "amount": false
    },
    payoutTotals: {
      open: 0,
      payingOut: 0
    }
  };
}

const hasControllingTasks = (employee: EntryRow) => (employee.controllingTasks?.length ?? 0) > 0;
const hasOpenAmount = (employee: EntryRow) => ((employee.entry?.netWage ?? 0) - (employee.entry?.paidOut ?? 0)) > 0;
const isRowSelectionEnabled = (row: EntryRow) => !hasControllingTasks(row) && hasOpenAmount(row);

type AmountInputProps = {
  employee: EntryRow
  dispatch: Dispatch<Action>
  onClick: MouseEventHandler
}

function AmountInput({ employee, dispatch, onClick }: AmountInputProps) {
  if (!employee.entry?.openPayout)
    return;

  const handleChange = ({ floatValue }) => {
    dispatch({ type: "set_amount", id: employee.id, amount: floatValue });
  };

  const receiveFocus = () => {
    dispatch({ type: "set_selected", id: employee.id, selected: true });
  }

  return (
    <NumericFormat
      onClick={onClick}
      value={employee.amount}
      onValueChange={handleChange}
      onFocus={receiveFocus}
      valueIsNumericString
      thousandSeparator={groupSeparator ?? ""}
      decimalScale={2}
      fixedDecimalScale
      customInput={TextField}
      type="numeric"
      size="small"
      isAllowed={(values) => {
        const { floatValue } = values;
        return (floatValue ?? 0) <= (employee.entry?.openPayout ?? 0);
      }}
      slotProps={{
        htmlInput: {
          style: {
            textAlign: "right",
            padding: "4px 8px 4px 0"
          }
        }
      }}
    />
  );
}
