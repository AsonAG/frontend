import React, { PropsWithChildren, useMemo, useReducer } from "react";
import { Form, Link, Outlet, useLoaderData } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip, Paper, Button, Checkbox, SxProps, Theme, Chip, Box } from "@mui/material";
import { Attachment, CalendarMonth, Check, CheckCircle, Error, FilterList, Refresh } from "@mui/icons-material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { useSearchParam } from "../hooks/useSearchParam";
import { CaseTask } from "../components/CaseTask";
import { Employee } from "../models/Employee";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import { PayrunPeriod } from "../models/PayrunPeriod";
import dayjs from "dayjs";
import { IdType } from "../models/IdType";

export function PayrunDashboard() {
  const { t } = useTranslation();
  return (
    <>
      <ContentLayout title={t("Payroll")}>
        <EmployeeTable />
      </ContentLayout>
      <Outlet />
    </>
  );
}

const chipSx = {
  ml: 1,
  "& .MuiChip-label": {
    p: 0.75
  }
};

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
}

function EmployeeTable() {
  const { t } = useTranslation();
  const { employees, payrunPeriod } = useLoaderData() as LoaderData;
  const [ml, sl] = useMemo(() => {
    const ml: Array<Employee> = [];
    const sl: Array<Employee> = [];
    for (let i = 0; i < employees.length; i++) {
      if ([1, 3, 5, 6, employees.length - 1].includes(i)) {
        ml.push(employees[i]);
      } else {
        sl.push(employees[i]);
      }
    }
    return [ml, sl];
  }, [employees])
  const [state, dispatch] = useReducer(
    reducer,
    employees,
    createInitialState
  );
  const { filtered, selected, mode } = state;
  const entriesMap = useMemo(() => new Map(payrunPeriod.entries.map(e => [e.employeeId, e])), [payrunPeriod.entries]);

  const [totalGross, totalNetto, totalAdvancePayments, totalOpen] = useMemo(() => {
    let totalGross = 0;
    let totalNetto = 0;
    let totalAdvancePayments = 0;
    for (let se of selected) {
      const entry = entriesMap.get(se.id);
      totalGross += entry?.grossWage ?? 0;
      totalNetto += entry?.netWage ?? 0;
      totalAdvancePayments += entry?.paidOut ?? 0;
    }

    return [totalGross, totalNetto, totalAdvancePayments, totalNetto - totalAdvancePayments];
  }, [selected, entriesMap]);
  return (
    <Stack spacing={1} >
      <Stack direction="row" spacing={2} flex={1} sx={{ pr: 0.5 }} alignItems="center">
        <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33 }}>
          <PeriodSection payrunPeriod={payrunPeriod.id} periodStart={payrunPeriod.periodStart} />
          <Chip icon={<FilterList />} sx={chipSx} onClick={() => { dispatch({ type: "reset_mode" }) }} color="primary" variant="outlined" />
          <Chip label="SL" variant={mode === "SL" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "SL", employees: sl }) }} color="primary" />
          <Chip label="ML" variant={mode === "ML" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "ML", employees: ml }) }} color="primary" />
        </Stack>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(totalGross)}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(totalNetto)}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{formatValue(totalAdvancePayments)}</Typography>
        <Stack sx={{ width: 186 }} alignItems="end">
          {totalOpen > 0 &&
            <Button variant="contained" sx={{ mr: 0.75 }} >
              <Stack direction="row">
                <Box component="span">
                  {formatValue(totalOpen)}
                </Box>
                <Box component="span" sx={{ width: 64, textAlign: "right" }}>
                  {t("Payout")}
                </Box>
              </Stack>
            </Button>
          }
        </Stack>
        <Stack sx={{ width: 30 }}></Stack>
      </Stack>
      <EmployeeHeaderRow />
      {filtered.map(e => {
        const onSelected = (event) => dispatch({ type: "set_employee_selection", checked: event.target.checked, employee: e });
        return <EmployeeRow key={e.id} employee={e} selected={selected.includes(e)} toggleSelected={onSelected} payrunEntry={entriesMap.get(e.id)} />;
      })}
    </Stack>
  )
}

function PeriodSection() {
  const { t } = useTranslation();
  const { payrunPeriod, documents } = useLoaderData() as LoaderData;
  const periodDate = dayjs.utc(payrunPeriod.periodStart).format("MMM YYYY");
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{t("Current period")}: </Typography>
      <Typography fontWeight="bold">{periodDate}</Typography>
      <IconButton size="small"><CalendarMonth /></IconButton>
      <Form method="post">
        <input type="hidden" name="payrunPeriodId" value={payrunPeriod.id} />
        <IconButton type="submit" color="primary" size="small" name="intent" value="calculate"><Refresh /></IconButton>
        <IconButton type="submit" color="primary" size="small" name="intent" value="close"><CheckCircle /></IconButton>
      </Form>
      {documents.map(doc => (
        <IconButton key={doc.id} component={Link} to={`${payrunPeriod.id}/doc/${doc.id}`} ><Attachment /></IconButton>
      ))}
    </Stack>
  );
}

function EmployeeHeaderRow() {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2} sx={{ p: 0.5 }}>
      <Typography variant="h6" flex={1} sx={{ py: 0.625 }} >{t("Employee")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Gross")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Net")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Paid")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Open")}</Typography>
      <Typography variant="h6" textAlign="center" sx={{ width: 70, py: 0.625 }} >{t("Blocker")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 30, py: 0.625 }} ></Typography>
    </Stack>
  );
}

function EmployeeRow({ employee, selected, toggleSelected, payrunEntry }) {
  const { t } = useTranslation();
  const grossWage = payrunEntry?.grossWage;
  const netWage = payrunEntry?.netWage;
  const advancePayment = payrunEntry?.paidOut;
  const [expanded, setExpanded] = useSearchParam("e");

  const possiblePayout = !!netWage ? netWage - (advancePayment ?? 0) : null;
  let stackSx: SxProps<Theme> = {
    borderRadius: 1,
    p: 0.5
  };
  const isExpanded = expanded === employee.id;
  const hasTasks = hasControllingTasks(employee);
  const elevation = isExpanded && hasTasks ? 1 : 0;
  if (selected) {
    stackSx.backgroundColor = (theme: Theme) => theme.palette.primary.hover;
  };

  return (
    <Stack component={Paper} elevation={elevation}>
      <Stack direction="row" spacing={2} sx={stackSx}>
        <Forbidden isForbidden={hasTasks} forbiddenText={t("This employee has blockers")}>
          <Checkbox sx={{ py: 0.625, mx: 0, width: 30, cursor: hasTasks ? "not-allowed" : undefined }} size="small" disableRipple checked={selected} onChange={toggleSelected} disabled={hasTasks} />
        </Forbidden>
        <Typography flex={1} noWrap sx={{ py: 0.625 }}><Tooltip title={employee.identifier} placement="right"><span>{employee.lastName} {employee.firstName}</span></Tooltip></Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{formatValue(grossWage)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{formatValue(netWage)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{formatValue(advancePayment)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{formatValue(possiblePayout)}</Typography>
        <Stack direction="row" sx={{ width: 70, justifyContent: "center" }}>
          {
            hasTasks ?
              <IconButton color="warning" size="small" onClick={() => setExpanded(isExpanded ? "" : employee.id)}><Error /></IconButton> :
              <IconButton color="success" size="small" disabled><Check /></IconButton>
          }
        </Stack>
        <Stack direction="row" sx={{ width: 30, justifyContent: "center" }}>
          <Tooltip title={t("Payslip")} placement="left">
            <IconButton size="small" component={Link} to={employee.documentUrl}><FilePresentRoundedIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {isExpanded && hasTasks &&
        <Stack>
          {employee.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={employee.id} type="P" />)}
        </Stack>
      }
    </Stack>
  );
}

type ForbiddenProps = PropsWithChildren & {
  isForbidden: boolean
  forbiddenText: string
}

function Forbidden({ isForbidden, forbiddenText, children }: ForbiddenProps) {
  if (!isForbidden)
    return children;

  return (
    <Tooltip title={forbiddenText}>
      <Box sx={{ cursor: "not-allowed" }}>
        {children}
      </Box>
    </Tooltip>
  )
}

type FilterMode = "All" | "ML" | "SL";

type State = {
  employees: Array<Employee>
  filtered: Array<Employee>
  selected: Array<Employee>
  mode: FilterMode
}

type Action = {
  type: "reset_mode"
} | {
  type: "toggle_mode"
  mode: "ML" | "SL"
  employees: Array<Employee>
} | {
  type: "set_employee_selection"
  employee: Employee
  checked: boolean
}

function reducer(state: State, action: Action): State {
  const resetState = (): State => ({
    ...state,
    filtered: state.employees,
    selected: [],
    mode: "All"
  });
  switch (action.type) {
    case "reset_mode":
      return resetState();
    case "toggle_mode": {
      if (action.mode === state.mode) {
        return resetState();
      }
      return {
        ...state,
        mode: action.mode,
        selected: action.employees.filter(e => !hasControllingTasks(e)),
        filtered: action.employees
      }
    }
    case "set_employee_selection":
      return {
        ...state,
        selected: action.checked ? [action.employee, ...state.selected] : state.selected.filter(e => e !== action.employee)
      };
  }
}

function createInitialState(employees: Array<Employee>): State {
  return {
    employees,
    filtered: employees,
    selected: [],
    mode: "All"
  };
}

const formatter = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function formatValue(value: number | null | undefined) {
  if (!value)
    return null;
  return formatter.format(value);
}
const hasControllingTasks = (employee: Employee) => (employee.controllingTasks?.length ?? 0) > 0;
