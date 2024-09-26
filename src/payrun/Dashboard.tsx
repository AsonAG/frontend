import React, { useMemo, useReducer } from "react";
import { useLoaderData } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip, Paper, Button, Checkbox, SxProps, Theme, Chip } from "@mui/material";
import { CalendarMonth, Check, Error, FilterList } from "@mui/icons-material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { useSearchParam } from "../hooks/useSearchParam";
import { CaseTask } from "../components/CaseTask";
import { Employee } from "../models/Employee";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';

export function PayrunDashboard() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Payroll")}>
      <EmployeeTable />
    </ContentLayout>
  );
}

const chipSx = {
  ml: 1,
  "& .MuiChip-label": {
    p: 0.75
  }
};

function EmployeeTable() {
  const { t } = useTranslation();
  const { employees } = useLoaderData() as { employees: Array<Employee> };
  const [ml, sl] = useMemo(() => {
    const ml = [];
    const sl = [];
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
  const [totalGross, totalNetto, totalOpen] = useMemo(() => {
    let totalGross = 0;
    let totalNetto = 0;
    let totalAdvancePayments = 0;
    for (let se of selected) {
      totalGross += (se.wageTypes?.find(wt => wt.wageTypeNumber === 5000)?.value ?? 0);
      totalNetto += (se.wageTypes?.find(wt => wt.wageTypeNumber === 6500)?.value ?? 0);
      totalAdvancePayments += (se.wageTypes?.find(wt => wt.wageTypeNumber === 6510)?.value ?? 0);
    }

    return [totalGross, totalNetto, totalNetto - totalAdvancePayments];
  }, [selected]);
  return (
    <Stack spacing={1} >
      <Stack direction="row" spacing={2} flex={1} sx={{ pr: 0.5 }} alignItems="center">
        <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33 }}>
          <PeriodSection />
          <Chip icon={<FilterList />} sx={chipSx} onClick={() => { dispatch({ type: "reset_mode" }) }} color="primary" variant="outlined" />
          <Chip label="SL" variant={mode === "SL" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "SL", employees: sl }) }} color="primary" />
          <Chip label="ML" variant={mode === "ML" ? "filled" : "outlined"} onClick={() => { dispatch({ type: "toggle_mode", mode: "ML", employees: ml }) }} color="primary" />
        </Stack>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{totalGross ? totalGross.toFixed(2) : null}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{totalNetto ? totalNetto.toFixed(2) : null}</Typography>
        <Typography fontWeight="bold" textAlign="right" sx={{ width: 100, py: 0.625 }} >{}</Typography>
        <Stack sx={{ width: 232 }} alignItems="end">
          {totalOpen > 0 &&
            <Button variant="contained" >{t("payout_sum", { amount: totalOpen.toFixed(2) })}</Button>
          }
        </Stack>
      </Stack>
      <EmployeeHeaderRow />
      {filtered.map(e => {
        const onSelected = (event) => dispatch({ type: "set_employee_selection", checked: event.target.checked, employee: e });
        return <EmployeeRow key={e.id} employee={e} selected={selected.includes(e)} toggleSelected={onSelected} />;
      })}
    </Stack>
  )
}

function PeriodSection() {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{t("Current period")}:</Typography>
      <Typography fontWeight="bold">Juli 2024</Typography>
      <IconButton size="small"><CalendarMonth /></IconButton>
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
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Paid out")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 100, py: 0.625 }} >{t("Open")}</Typography>
      <Typography variant="h6" textAlign="center" sx={{ width: 70, py: 0.625 }} >{t("Blocker")}</Typography>
      <Typography variant="h6" textAlign="right" sx={{ width: 30, py: 0.625 }} ></Typography>
    </Stack>
  );
}

function EmployeeRow({ employee, selected, toggleSelected }) {
  const { t } = useTranslation();
  const grossWage = employee.wageTypes?.find(wt => wt.wageTypeNumber === 5000)?.value;
  const netWage = employee.wageTypes?.find(wt => wt.wageTypeNumber === 6500)?.value;
  const advancePayment = employee.wageTypes?.find(wt => wt.wageTypeNumber === 6510)?.value;
  const [expanded, setExpanded] = useSearchParam("e");

  const possiblePayout = !!netWage ? netWage - (advancePayment ?? 0) : null;
  let stackSx: SxProps = {
    borderRadius: 1,
    p: 0.5
  };
  const isExpanded = expanded === employee.id;
  const hasControllingTasks = (employee.controllingTasks?.length ?? 0) > 0;
  const elevation = isExpanded && hasControllingTasks ? 1 : 0;
  if (selected) {
    stackSx.backgroundColor = (theme: Theme) => theme.palette.primary.hover;
  };

  return (
    <Stack component={Paper} elevation={elevation}>
      <Stack direction="row" spacing={2} sx={stackSx}>
        <Checkbox sx={{ py: 0.625, mx: 0, width: 30 }} size="small" disableRipple checked={selected} onChange={toggleSelected} />
        <Typography flex={1} noWrap sx={{ py: 0.625 }}><Tooltip title={employee.identifier} placement="right"><span>{employee.lastName} {employee.firstName}</span></Tooltip></Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{grossWage?.toFixed(2)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{netWage?.toFixed(2)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{advancePayment?.toFixed(2)}</Typography>
        <Typography textAlign="right" sx={{ width: 100, py: 0.625 }}>{possiblePayout?.toFixed(2)}</Typography>
        <Stack direction="row" sx={{ width: 70, justifyContent: "center" }}>
          {
            hasControllingTasks ?
              <IconButton color="warning" size="small" onClick={() => setExpanded(isExpanded ? "" : employee.id)}><Error /></IconButton> :
              <IconButton color="success" size="small" disabled><Check /></IconButton>
          }
        </Stack>
        <Stack direction="row" sx={{ width: 30, justifyContent: "center" }}>
          <Tooltip title={t("Payslip")} placement="left">
            <IconButton size="small"><FilePresentRoundedIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {isExpanded && hasControllingTasks &&
        <Stack>
          {employee.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={employee.id} type="P" />)}
        </Stack>
      }
    </Stack>
  );
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
        selected: action.employees,
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

function createInitialState(employees: Employee[]): State {
  return {
    employees,
    filtered: employees,
    selected: [],
    mode: "All"
  };
}
