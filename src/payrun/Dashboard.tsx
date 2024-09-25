import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Stack, Typography, IconButton, Tooltip, Paper, Button, Checkbox, SxProps, Theme } from "@mui/material";
import { CalendarMonth, Check, Error } from "@mui/icons-material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { useSearchParam } from "../hooks/useSearchParam";
import { CaseTask } from "../components/CaseTask";
import { Employee } from "../models/Employee";

export function PayrunDashboard() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Payruns")}>
      <EmployeeTable />
    </ContentLayout>
  );
}

function EmployeeTable() {
  const { t } = useTranslation();
  const { employees } = useLoaderData() as { employees: Array<Employee> };
  return (
    <Stack spacing={1} >
      <PeriodSection />
      <EmployeeHeaderRow />
      {employees.map(e => <EmployeeRow key={e.id} employee={e} />)}
      <Stack direction="row" justifyContent="end">
        <Button variant="contained">{t("Payout")}</Button>
      </Stack>
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
      <Typography variant="h6" sx={{ width: 30, py: 0.625 }} ></Typography>
      <Typography variant="h6" flex={1} sx={{ py: 0.625 }} >{t("Employee")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Gross")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Net")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Paid out")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Open")}</Typography>
      <Typography variant="h6" sx={{ width: 70, py: 0.625 }} >{t("Blocker")}</Typography>
    </Stack>
  );
}

function EmployeeRow({ employee }) {
  const [selected, setSelected] = useState(false);
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
        <Checkbox sx={{ py: 0.625, mx: 0, width: 30 }} size="small" disableRipple checked={selected} onChange={e => setSelected(e.target.checked)} />
        <Typography flex={1} noWrap sx={{ py: 0.625 }}><Tooltip title={employee.identifier} placement="right"><span>{employee.lastName} {employee.firstName}</span></Tooltip></Typography>
        <Typography sx={{ width: 100, py: 0.625 }}>{grossWage?.toFixed(2)}</Typography>
        <Typography sx={{ width: 100, py: 0.625 }}>{netWage?.toFixed(2)}</Typography>
        <Typography sx={{ width: 100, py: 0.625 }}>{advancePayment?.toFixed(2)}</Typography>
        <Typography sx={{ width: 100, py: 0.625 }}>{possiblePayout?.toFixed(2)}</Typography>
        <Stack direction="row" sx={{ width: 70, justifyContent: "center" }}>
          {
            hasControllingTasks ?
              <IconButton color="warning" size="small" onClick={() => setExpanded(isExpanded ? "" : employee.id)}><Error /></IconButton> :
              <IconButton color="success" size="small" disabled><Check /></IconButton>
          }
        </Stack>
        {
        }
      </Stack>
      {isExpanded && hasControllingTasks &&
        <Stack>
          {employee.controllingTasks?.map(task => <CaseTask key={task.name} _case={task} objectId={employee.id} type="P" />)}
        </Stack>
      }
    </Stack>
  );
}
