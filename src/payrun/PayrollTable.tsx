import React, { Dispatch, memo, PropsWithChildren, useMemo, useReducer } from "react";
import { useRouteLoaderData, useSubmit } from "react-router-dom";
import { Stack, Typography, Tooltip, SxProps, Theme, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Payout } from "./Payouts";
import { Column, flexRender, getCoreRowModel, getSortedRowModel, Row, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { IdType } from "../models/IdType";
import { useAtomValue } from "jotai";
import { columnVisibilityAtom, fullWidthTableAtom } from "./TableSettings";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";
import { getRowGridSx, getStickySx } from "./utils";
import { EntryRow, PayoutTotals, PeriodTotals } from "./types";
import { columns } from "./TableColumns";
import { PayoutFooter } from "./PayoutFooter";


export type PayrunTableState = {
  entries: EntryRow[]
  selected: RowSelectionState
  fullSelectionCount: number
  payoutTotals: PayoutTotals
  selectedEmployeeCount: number
}

export type PayrunTableAction = {
  type: "set_selected"
  id: IdType
  selected: boolean
} | {
  type: "toggle_selected"
} | {
  type: "set_amount"
  id: IdType
  amount: number
}

type PayrunTableProps = {
  completed: boolean
  entries: Array<EntryRow>
}
const isRowSelectionEnabled = (row: EntryRow) => !hasControllingTasks(row) && hasOpenAmount(row);
const hasControllingTasks = (entry: EntryRow) => (entry.controllingTasks?.length ?? 0) > 0;
const hasOpenAmount = (entry: EntryRow) => ((entry.openPayout ?? 0)) > 0;

export const PayrunTable = memo(function PayrunTable({ entries, completed }: PayrunTableProps) {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;

  const [state, dispatch] = useReducer(reducer, entries, createInitialState);

  const configuredColumnVisibility = useAtomValue(columnVisibilityAtom);
  const columnVisibility: VisibilityState = { ...configuredColumnVisibility }
  if (completed) {
    columnVisibility.open = false;
    columnVisibility.amount = false
  }

  const periodTotals = useMemo(() => getPeriodTotals(entries), [entries]);

  const table = useReactTable({
    columns: columns,
    data: entries,
    initialState: {
      sorting: [
        {
          id: 'openPayout',
          desc: false
        },
      ],
    },
    state: {
      periodTotals: periodTotals,
      payoutTotals: state.payoutTotals,
      columnVisibility,
      rowSelection: state.selected,
      columnPinning: {
        left: ["identifier", "employee"],
        right: ["openPayout", "amount", "documents", "events"]
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: (row) => !completed && isRowSelectionEnabled(row.original),
    getRowId: originalRow => originalRow.id,
  });

  const submit = useSubmit();

  const onPayout = async (valueDate: string, accountIban: string) => {
    const payouts = entries.filter(e => state.selected[e.id]).map(x => ({ employeeId: x.employeeId, amount: x.amount || 0 }));
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
  const useFullWidth = useAtomValue(fullWidthTableAtom);
  const containerWidth = useFullWidth ?
    {
      position: { lg: "absolute" },
      left: { lg: "calc(264px + 3 * var(--mui-spacing))" },
      right: { lg: "calc(3 * var(--mui-spacing))" }
    } : {}
  return (
    <Stack>
      <Stack sx={{ overflow: "auto", height: "calc(100vh - 173px)", ...containerWidth }}>
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
              const context = { ...header.getContext(), t, dispatch, state, completed };
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
            <TableRow
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
          !completed &&
          <PayoutFooter
            employeeCount={state.selectedEmployeeCount}
            totalPayingOut={state.payoutTotals.payingOut}
            onPayout={onPayout}
            minWidth={minWidth}>
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
})

type TableRowProps = {
  row: Row<EntryRow>
  onClick?: () => void
  containerSx: SxProps<Theme>
  minWidth?: number,
  dispatch: Dispatch<PayrunTableAction>
}

function TableRow({ row, onClick, containerSx, dispatch }: TableRowProps) {
  const { t } = useTranslation();
  let stackSx: SxProps<Theme> = {
    userSelect: "none",
    minHeight: 32,
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
  const rowSx: SxProps<Theme> = { ...stackSx, ...containerSx };
  const visibleCells = row.getVisibleCells();
  return (
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
  );
}

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
function getSelectedState(rows: Array<EntryRow>): RowSelectionState {
  if (!rows)
    return {};
  return Object.fromEntries(rows.map(r => [r.id, isRowSelectionEnabled(r)]));
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
    employerCost: 0,
    previousGross: 0,
    diffGross: 0,
    gross: 0,
    net: 0,
    offsetting: 0,
    retro: 0,
    openGarnishmentPayoutPreviousPeriod: 0,
    openWagePayoutPreviousPeriod: 0,
    paid: 0,
    garnishment: 0,
    open: 0,
  };
  if (!Array.isArray(entries)) {
    return totals;
  }

  for (let entry of entries) {
    totals.employerCost += entry?.employerCost ?? 0;
    totals.previousGross += entry.previousEntry?.grossWage ?? 0;
    totals.gross += entry?.grossWage ?? 0;
    totals.net += entry?.netWage ?? 0;
    totals.offsetting += entry?.offsetting ?? 0;
    totals.retro += entry?.retro ?? 0;
    totals.openGarnishmentPayoutPreviousPeriod += entry?.openGarnishmentPayoutPreviousPeriod ?? 0;
    totals.openWagePayoutPreviousPeriod += entry?.openWagePayoutPreviousPeriod ?? 0;
    totals.paid += ((entry?.paidOut ?? 0) + (entry?.paidOutGarnishment ?? 0));
    totals.garnishment += entry?.garnishment ?? 0;
    totals.open += entry?.openPayout ?? 0;
  }
  totals.diffGross = totals.gross - totals.previousGross;
  return totals;
}


function reducer(state: PayrunTableState, action: PayrunTableAction): PayrunTableState {
  let newState: PayrunTableState;
  switch (action.type) {
    case "set_selected":
      const selected = {
        ...state.selected,
        [action.id]: action.selected
      };
      newState = {
        ...state,
        selected: selected,
      };
      break;
    case "toggle_selected":
      newState = {
        ...state,
        selected: state.selectedEmployeeCount < state.fullSelectionCount ? getSelectedState(state.entries) : {},
      };
      break;
    case "set_amount":

      const employee = state.entries.find(e => e.id === action.id);
      if (employee) {
        employee.amount = action.amount;
      }
      newState = { ...state };
      break;
  }
  newState.payoutTotals = getPayoutTotals(newState.entries, newState.selected);
  newState.selectedEmployeeCount = Object.values(newState.selected).filter(Boolean).length;
  return newState;
}


function createInitialState(entries: EntryRow[]): PayrunTableState {
  return {
    entries,
    selected: {},
    fullSelectionCount: getSelectionCount(getSelectedState(entries)),
    selectedEmployeeCount: 0,
    payoutTotals: {
      open: 0,
      payingOut: 0
    }
  };
}

const noop = () => { };
function createRowClickHandler(row: Row<EntryRow>, state: PayrunTableState, dispatch: Dispatch<PayrunTableAction>) {
  if (row.getCanSelect()) {
    return () => {
      dispatch({ type: "set_selected", id: row.original.id, selected: !state.selected[row.id] });
    };
  }
  return noop;
}

function getSelectionCount(state: RowSelectionState) { return Object.values(state).filter(Boolean).length; }


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

