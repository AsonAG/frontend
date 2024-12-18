import React, { Dispatch, MouseEventHandler, PropsWithChildren, useMemo, useReducer } from "react";
import { Link, Outlet, useNavigate, useRouteLoaderData } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip, Paper, Button, SxProps, Theme, Chip, Box, TextField, Badge } from "@mui/material";
import { Check, Error as ErrorIcon, FilterList, TrendingDown, TrendingUp } from "@mui/icons-material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { CaseTask } from "../components/CaseTask";
import { Employee } from "../models/Employee";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import { PayrunPeriod, PayrunPeriodEntry } from "../models/PayrunPeriod";
import dayjs from "dayjs";
import { createPayout, getPayouts } from "./Payouts";
import { createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, Row, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { TFunction } from "i18next";
import { AvailableCase } from "../models/AvailableCase";
import { IdType } from "../models/IdType";
import { NumericFormat } from "react-number-format";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "../components/ResponsiveDialog";
import { DatePicker } from "../components/DatePicker";
import { useAtom } from "jotai";
import { expandedControllingTasks } from "../utils/dataAtoms";
import { DashboardHeader } from "./DashboardHeader";

declare module '@tanstack/react-table' {
  //@ts-ignore -
  interface ColumnMeta<TData extends RowData, TValue> {
    alignment: "left" | "center" | "right"
  }
}

export function PayrunDashboard() {
  return (
    <>
      <ContentLayout title={<DashboardHeader backlinkPath="../list" />}>
        <EmployeeTable />
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

function createColumns(t: TFunction<"translation", undefined>, dispatch: Dispatch<Action>) {
  return [
    columnHelper.accessor(row => `${row.lastName} ${row.firstName}`,
      {
        id: "employeeName",
        cell: (props) => {
          return (
            <Typography key={props.row.id} noWrap>
              <Tooltip title={props.row.original.identifier} placement="right">
                <span>{props.getValue()}</span>
              </Tooltip>
            </Typography>
          )
        },
        header: t("Employee"),
        size: Number.MAX_SAFE_INTEGER
      }),
    columnHelper.accessor("entry.grossWage",
      {
        cell: (props) => <Wage name="grossWage" entry={props.row.original} t={t} />,
        header: t("Gross"),
        size: 100,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor("entry.netWage",
      {
        cell: (props) => <Wage name="netWage" entry={props.row.original} t={t} />,
        header: t("Net"),
        size: 100,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor("entry.paidOut",
      {
        cell: paid => <Typography textAlign="right">{formatValue(paid.getValue())}</Typography>,
        header: t("Paid"),
        size: 100,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor("open",
      {
        id: "open",
        cell: open => <Typography textAlign="right">{formatValue(open.getValue())}</Typography>,
        header: t("Open"),
        size: 100,
        meta: {
          alignment: "right"
        }
      }),
    columnHelper.accessor("amount",
      {
        id: "amount",
        cell: function(props) {
          if (props.row.getCanExpand()) {
            return;
          }
          const onClick: MouseEventHandler = (event) => {
            if (props.row.getIsSelected()) {
              event.stopPropagation();
            }
          }
          return <AmountInput employee={props.row.original} dispatch={dispatch} onClick={onClick} />;
        },
        header: t("Amount"),
        size: 162,
        meta: {
          alignment: "right"
        }
      }),

    columnHelper.display({
      id: "blocker",
      header: t("Blocker"),
      cell: (props) => {
        return props.row.getCanExpand() ?
          <IconButton color="warning" size="small" onClick={props.row.getToggleExpandedHandler()} sx={{ m: "auto" }}><ErrorIcon /></IconButton> :
          <IconButton color="success" size="small" disabled><Check /></IconButton>
      },
      size: 70,
      meta: {
        alignment: "center"
      }
    }),
    columnHelper.display({
      id: "documents",
      cell: (props) => {
        const payrunEntry = props.row.original.entry;
        return (
          <Stack direction="row" sx={{ width: 30, justifyContent: "center" }}>
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
      size: 30
    }),
    columnHelper.display({
      id: "events",
      cell: (props) => {
        const { entry, caseChangeCount } = props.row.original;
        if (!entry || caseChangeCount === 0)
          return <div></div>;
        return (
          <Stack direction="row" sx={{ width: 30, justifyContent: "center" }}>
            <Tooltip title={t("Events")} placement="left">
              <Badge badgeContent={caseChangeCount} color="info">
                <IconButton size="small" component={Link} to={`employees/${entry.employeeId}/events`} onClick={stopPropagation}><WorkHistoryOutlinedIcon /></IconButton>
              </Badge>
            </Tooltip>
          </Stack>
        )
      },
      size: 30
    })
  ];
}

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingTasks: Array<Array<AvailableCase>>
  caseChangeCounts: Array<number>
}

type EntryRow = Employee & {
  entry: PayrunPeriodEntry | undefined
  previousEntry: PayrunPeriodEntry | undefined
  open: number | undefined
  amount: number | undefined
  controllingTasks: Array<AvailableCase> | undefined
  caseChangeCount: number
}

function getFilteredEmployees(employees: Array<EntryRow>, type: "ML" | "SL") {
  const predicate = (_: any, i: number) => [1, 3, 5, 6, employees.length - 1].includes(i);
  const inverted = (_: any, i: number) => !predicate(_, i);
  const filterPredicate = type === "SL" ? predicate : inverted;
  return employees.filter(filterPredicate);
}


const noop = () => { };
function createRowClickHandler(row: Row<EntryRow>, state: State, dispatch: Dispatch<Action>) {
  if (!row.getCanSelect())
    return noop;
  return () => {
    dispatch({ type: "set_selected", id: row.id, selected: !state.selected[row.id] });
  };
}

function EmployeeTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { employees, payrunPeriod, previousPayrunPeriod, controllingTasks, caseChangeCounts } = useRouteLoaderData("payrunperiod") as LoaderData;
  const payouts = useMemo(() => getPayouts(payrunPeriod.id).flatMap(p => p.entries), [payrunPeriod.id]);
  const [expanded, setExpanded] = useAtom(expandedControllingTasks);
  const isOpen = payrunPeriod.periodStatus === "Open";
  const employeeRows: Array<EntryRow> = useMemo(() => {
    function mapEmployee(employee: Employee, index: number): EntryRow {
      var paidOut = payouts.filter(p => p.employeeId === employee.id).reduce((a, b) => a + b.amount, 0);
      let entry = payrunPeriod?.entries?.find(entry => entry.employeeId === employee.id);
      if (entry) {
        entry = {
          ...entry,
          paidOut
        };
      }
      return {
        ...employee,
        entry: entry,
        previousEntry: previousPayrunPeriod?.entries?.find(entry => entry.employeeId == employee.id),
        open: (entry?.netWage ?? 0) - paidOut,
        amount: (entry?.netWage ?? 0) - paidOut,
        controllingTasks: isOpen ? controllingTasks[index] : [],
        caseChangeCount: caseChangeCounts[index]
      }
    }
    return employees.map(mapEmployee);
  }, [employees, payrunPeriod?.entries]);


  const [state, dispatch] = useReducer(
    reducer,
    employeeRows,
    createInitialState
  );
  const { filtered, filter: mode } = state;
  const columns = useMemo(() => createColumns(t, dispatch), [dispatch]);
  const table = useReactTable({
    columns: columns,
    data: filtered,
    state: {
      expanded,
      rowSelection: state.selected,
      columnVisibility: isOpen ? state.columnVisibility : {
        "open": false,
        "amount": false,
        "blocker": false
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) => isOpen && hasControllingTasks(row.original),
    onExpandedChange: setExpanded,
    enableRowSelection: (row) => isOpen && isRowSelectionEnabled(row.original),
    getRowId: originalRow => originalRow.id,
  });

  const onPayout = () => {
    createPayout(payrunPeriod.id, state.employees.filter(e => state.selected[e.id]).map(x => ({ employeeId: x.id, amount: x.amount || 0 })));
    navigate("payouts");
  };

  const rowContainerProps = getRowGridProps(table.getVisibleFlatColumns().map(col => col.getSize()));
  return (
    <Stack>
      <Stack direction="row" spacing={2} flex={1} sx={{ pr: 0.5 }} alignItems="center">
        <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33 }}>
          <Chip icon={<FilterList />} sx={chipSx} onClick={() => { dispatch({ type: "reset_mode" }) }} color="primary" variant="outlined" />
          <Chip label="SL" variant={mode === "SL" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "SL" }) }} color="primary" />
          <Chip label="ML" variant={mode === "ML" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "ML" }) }} color="primary" />
        </Stack>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(state.totals.gross)}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(state.totals.net)}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(state.totals.paidOut)}</Typography>
        <Stack sx={{ width: 232 }} alignItems="end">
          {state.totals.open > 0 &&
            <ResponsiveDialog>
              <ResponsiveDialogTrigger>
                <Button variant="contained" sx={{ px: 1 }}>
                  <Stack direction="row">
                    <span>{t("Payout")}:&nbsp;</span>
                    <span>{formatValue(state.totals.payingOut)}</span>
                  </Stack>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <Typography variant="h6">{t("Auszahlen")}</Typography>
                <Box {...getRowGridProps([120, Number.MAX_SAFE_INTEGER])}>
                  <Typography>{t("Employee number")}</Typography>
                  <Typography fontWeight="bold">{Object.values(state.selected).filter(Boolean).length}</Typography>
                </Box>
                <Box {...getRowGridProps([120, Number.MAX_SAFE_INTEGER])}>
                  <Typography>{t("Amount")}</Typography>
                  <Typography fontWeight="bold">{formatValue(state.totals.payingOut)} CHF</Typography>
                </Box>
                <Box {...getRowGridProps([120, Number.MAX_SAFE_INTEGER])}>
                  <Typography>{t("Bank account")}</Typography>
                  <BankAccountSelector />
                </Box>
                <Box {...getRowGridProps([120, Number.MAX_SAFE_INTEGER])}>
                  <Typography>{t("Value date")}</Typography>
                  <DatePicker variant="standard" defaultValue={dayjs()}></DatePicker>
                </Box>
                <Stack direction="row" justifyContent="end" spacing={2}>
                  <ResponsiveDialogClose>
                    <Button>{t("Cancel")}</Button>
                  </ResponsiveDialogClose>
                  <ResponsiveDialogClose>
                    <Button component="a" href="" download={`PainFile_${dayjs().format("YYYYMMDD")}.xml`} variant="contained" onClick={onPayout}>{t("Confirm")}</Button>
                  </ResponsiveDialogClose>
                </Stack>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          }
        </Stack>
      </Stack>
      {table.getHeaderGroups().map(headerGroup => (
        <Box key={headerGroup.id} component="div" {...rowContainerProps} sx={{ px: 0.5, py: 1.125 }}>
          {headerGroup.headers.map(header => {
            const alignment = header.column.columnDef.meta?.alignment ?? "left";
            return <Typography key={header.id} variant="h6" textAlign={alignment}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext())}
            </Typography>;
          })}
        </Box>
      ))}
      {table.getRowModel().rows.map(row =>
        <EmployeeRow
          key={row.id}
          row={row}
          onClick={createRowClickHandler(row, state, dispatch)}
          containerProps={rowContainerProps}
        />)}
    </Stack>
  )
}



type DashboardRowProps = {
  row: Row<EntryRow>
  onClick: () => void
  containerProps: Object
}

function EmployeeRow({ row, onClick, containerProps }: DashboardRowProps) {
  const { t } = useTranslation();
  let stackSx: SxProps<Theme> = {
    borderRadius: 1,
    p: 0.5,
    userSelect: "none",
    height: 40
  };
  if (row.getCanSelect()) {
    stackSx["&:hover"] = {
      backgroundColor: (theme: Theme) => theme.palette.primary.hover,
      cursor: "pointer"
    };
    if (row.getIsSelected()) {
      stackSx.backgroundColor = (theme: Theme) => `${theme.palette.primary.active} !important`
    };
  }
  const isBlocked = hasControllingTasks(row.original);
  if (isBlocked) {
    stackSx.backgroundColor = (theme: Theme) => `rgba(${theme.palette.warning.mainChannel} / 0.05)`;
  }
  const elevation = row.getIsExpanded() ? 1 : 0;
  const visibleCells = row.getVisibleCells();
  return (
    <Stack component={Paper} elevation={elevation} sx={{ transition: "none" }}>
      <Forbidden isForbidden={isBlocked} forbiddenText={t("This employee has blockers")} >
        <Box component="div" sx={stackSx} onClick={onClick} {...containerProps}>
          {visibleCells.map((cell) => flexRender(cell.column.columnDef.cell, { ...cell.getContext(), key: cell.id }))}
        </Box>
      </Forbidden>
      {row.getIsExpanded() &&
        <Stack>
          {row.original.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={row.original.id} type="P" />)}
        </Stack>
      }
    </Stack >
  );
}

export function getRowGridProps(columnSizes: Array<number>) {
  const templateColumns = columnSizes.map(size => {
    if (size === Number.MAX_SAFE_INTEGER) {
      return "1fr"
    }
    return size + "px";
  }).join(" ");
  return {
    display: "grid",
    gap: 2,
    gridTemplateColumns: templateColumns,
    gridTemplateRows: "auto",
    alignItems: "center"
  }
}

type WageProps = {
  name: string
  entry: EntryRow
  t: TFunction<"translation", undefined>
}
function Wage({ name, entry, t }: WageProps) {
  const styling = getWageTypeStyling(name, entry);
  var typo = (
    <Typography
      sx={{ color: styling.textColor, display: "flex", alignItems: "center", justifyContent: "right", gap: 1 }}>
      {styling.icon}{formatValue(entry.entry?.[name])}
    </Typography>
  )
  if (!styling.value)
    return typo;
  return (
    <Tooltip title={`${t("Value from previous period")} ${formatValue(styling.value)}`}>
      {typo}
    </Tooltip>
  )
}
function getWageTypeStyling(name: string, entry: EntryRow) {
  const wage = entry.entry?.[name];
  if (!wage) {
    return {};
  }
  const previousWage = entry.previousEntry?.[name];
  if (!previousWage) {
    return {};
  }
  if (wage === previousWage) {
    return {};
  }
  if (wage > previousWage) {
    return {
      textColor: "green",
      icon: <TrendingUp fontSize="small" />,
      value: previousWage
    }
  }
  if (wage < previousWage) {
    return {
      textColor: "red",
      icon: <TrendingDown fontSize="small" />,
      value: previousWage
    }
  }
  return {}
}

type ForbiddenProps = PropsWithChildren & {
  isForbidden: boolean
  forbiddenText: string
}

function Forbidden({ isForbidden, forbiddenText, children }: ForbiddenProps) {
  if (!isForbidden)
    return children;

  return (
    <Tooltip title={forbiddenText} followCursor>
      <Box sx={{ cursor: "not-allowed" }}>
        {children}
      </Box>
    </Tooltip>
  )
}

type FilterMode = "All" | "ML" | "SL";

type State = {
  employees: Array<EntryRow>
  filtered: Array<EntryRow>
  selected: RowSelectionState
  expanded: ExpandedState
  columnVisibility: VisibilityState
  filter: FilterMode
  mode: "view" | "payout"
  totals: {
    gross: number
    net: number
    open: number
    paidOut: number
    payingOut: number
  }
}

type Action = {
  type: "reset_mode"
} | {
  type: "toggle_mode"
  mode: "ML" | "SL"
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
  stateAfterAction.totals = getTotals(stateAfterAction.employees, stateAfterAction.selected);
  stateAfterAction.mode = Object.values(stateAfterAction.selected).some(s => s) ? "payout" : "view";
  stateAfterAction.columnVisibility = stateAfterAction.mode === "view" ? { "amount": false } : {
    "blocker": false,
    "documents": false,
    "events": false
  }
  return stateAfterAction;
}

function getTotals(employees: Array<EntryRow>, selected: RowSelectionState) {
  let totals = {
    gross: 0,
    net: 0,
    paidOut: 0,
    open: 0,
    payingOut: 0
  }

  for (let employee of employees) {
    if (!selected[employee.id])
      continue;
    const entry = employee.entry;
    totals.gross += entry?.grossWage ?? 0;
    totals.net += entry?.netWage ?? 0;
    totals.paidOut += entry?.paidOut ?? 0;
    totals.payingOut += employee.amount ?? 0;
  }
  totals.open = totals.net - totals.paidOut;
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
    totals: getTotals([], {})
  };
}

const formatter = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parts = formatter.formatToParts(1000);
const groupSeparator = parts.find(p => p.type === "group")?.value;
function formatValue(value: number | null | undefined) {
  if (!value)
    return null;
  return formatter.format(value);
}
const hasControllingTasks = (employee: EntryRow) => (employee.controllingTasks?.length ?? 0) > 0;
const hasOpenAmount = (employee: EntryRow) => ((employee.entry?.netWage ?? 0) - (employee.entry?.paidOut ?? 0)) > 0;
const isRowSelectionEnabled = (row: EntryRow) => !hasControllingTasks(row) && hasOpenAmount(row);

type AmountInputProps = {
  employee: EntryRow
  dispatch: Dispatch<Action>
  onClick: MouseEventHandler
}

export function AmountInput({ employee, dispatch, onClick }: AmountInputProps) {
  if (!employee.open)
    return;

  const handleChange = ({ floatValue }) => {
    dispatch({ type: "set_amount", id: employee.id, amount: floatValue });
  };

  return (
    <NumericFormat
      onClick={onClick}
      value={employee.amount}
      onValueChange={handleChange}
      valueIsNumericString
      thousandSeparator={groupSeparator ?? ""}
      decimalScale={2}
      fixedDecimalScale
      customInput={TextField}
      type="numeric"
      size="small"
      isAllowed={(values) => {
        const { floatValue } = values;
        return (floatValue ?? 0) <= (employee.open ?? 0);
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

function BankAccountSelector() {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{
      userSelect: "none",
      px: 1,
      cursor: "pointer",
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 1,
      borderColor: theme => `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`,
      "&:hover": {
        borderColor: theme => theme.palette.text.primary
      }
    }}>
      <AccountBalanceIcon />
      <Stack>
        <Typography variant="subtitle2">UBS Lohnkonto</Typography>
        <Typography variant="body2">CH93 0076 2011 6238 5295 7</Typography>
      </Stack>
    </Stack>
  )
}
