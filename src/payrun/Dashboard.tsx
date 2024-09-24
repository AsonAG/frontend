import React, { Suspense } from "react";
import { Link, useSubmit, useLoaderData, Await, useOutlet, useAsyncValue } from "react-router-dom";
import { Stack, Typography, Skeleton, Divider, IconButton, Tooltip, Paper, Button } from "@mui/material";
import { Add, Cancel, Clear, DangerousRounded, DoneAll, Error, InsightsRounded, Mode, Outbox, SyncAlt } from "@mui/icons-material";
import { ContentLayout } from "../components/ContentLayout";
import { ErrorView } from "../components/ErrorView";
import { useTranslation } from "react-i18next";
import { PaginatedContent } from "../components/PaginatedContent";
import { getEmployeeDisplayString } from "../models/Employee";

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
  const { employees } = useLoaderData();
  return (
    <Stack spacing={1}>
      <EmployeeHeaderRow />
      {employees.map(e => <EmployeeRow key={e.id} employee={e} />)}
      <Stack direction="row" justifyContent="end">
        <Button variant="contained">{t("Payout")}</Button>
      </Stack>
    </Stack>
  )
}

function EmployeeHeaderRow() {
  const { t } = useTranslation();
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="h6" flex={1} sx={{ py: 0.625 }} >{t("Employee")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Net")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Paid out")}</Typography>
      <Typography variant="h6" sx={{ width: 100, py: 0.625 }} >{t("Open")}</Typography>
      <Typography variant="h6" sx={{ width: 200, py: 0.625 }} >{t("Controlling")}</Typography>
    </Stack>
  );
}
function EmployeeRow({ employee }) {
  const { t } = useTranslation();
  const netWage = employee.wageTypes?.find(wt => wt.wageTypeNumber === 6500)?.value;
  const advancePayment = employee.wageTypes?.find(wt => wt.wageTypeNumber === 6510)?.value;

  const possiblePayout = !!netWage ? netWage - (advancePayment ?? 0) : null;
  return (
    <Stack direction="row" spacing={2}>
      <Typography flex={1} noWrap sx={{ py: 0.625 }}>{getEmployeeDisplayString(employee)}</Typography>
      <Typography sx={{ width: 100, py: 0.625 }}>{netWage?.toFixed(2)}</Typography>
      <Typography sx={{ width: 100, py: 0.625 }}>{advancePayment?.toFixed(2)}</Typography>
      <Typography sx={{ width: 100, py: 0.625 }}>{possiblePayout?.toFixed(2)}</Typography>
      <Stack direction="row" sx={{ width: 200, flexWrap: "wrap" }}>
        {employee.controllingTasks?.map(task => <TaskButton key={task.name} task={task} />)}
      </Stack>
    </Stack>
  );
}

function TaskButton({ task }) {
  return (
    <Tooltip title={task.displayName}>
      <IconButton color="warning" size="small">
        <Error />
      </IconButton>
    </Tooltip>
  )
}

function PeriodView() {
  return (
    <Stack>
      <Typography>Aktuelle Periode</Typography>
    </Stack>
  );
}

function AwaitPayrunJobs() {
  const { payrunJobs } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Await resolve={payrunJobs} errorElement={<ErrorView />}>
        <PayrunJobs />
      </Await>
    </Suspense>
  );
}

function PayrunJobs() {
  const jobs = useAsyncValue();
  if (jobs.count === 0) {
    return null;
  }
  return (
    <PaginatedContent>
      <Paper variant="outlined">
        <Stack divider={<Divider flexItem />}>
          {jobs.items.map(job => <PayrunJobRow key={job.id} payrunJob={job} />)}
        </Stack>
      </Paper>
    </PaginatedContent>
  )
}

function AwaitDraftPayrun() {
  const { draftPayrunJobs } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Await resolve={draftPayrunJobs} errorElement={<ErrorView />}>
        <DraftPayrun />
      </Await>
    </Suspense>
  );
}

function DraftPayrun() {
  const drafts = useAsyncValue();
  return drafts.length > 0 ? <DraftPayrunJobRow payrunJob={drafts[0]} /> : <NewPayrunJobRow />;
}

function DraftPayrunJobRow({ payrunJob }) {
  const { abort, complete } = useChangeStatus(payrunJob.id);
  const { t } = useTranslation();
  const buttons = (
    <Stack direction="row">
      <Tooltip title={t("Abort")}>
        <IconButton sx={{ "&:hover": { color: theme => theme.palette.error.light } }} size="small" onClick={abort}><Clear /></IconButton>
      </Tooltip>
      <Tooltip title={t("Release")}>
        <IconButton color="primary" size="small" onClick={complete}><DoneAll /></IconButton>
      </Tooltip>
    </Stack>
  );
  const icon = <JobIcon payrunJob={payrunJob} />;
  return (
    <Paper variant="outlined">
      <Row icon={icon} title={payrunJob.name} subtitle={payrunJob.reason} buttons={buttons} bgcolor="rgba(255, 221, 0, 0.2)" />
    </Paper>
  );
}

function PayrunJobRow({ payrunJob }) {
  const icon = <JobIcon payrunJob={payrunJob} />
  return <Row icon={icon} title={payrunJob.name} subtitle={payrunJob.reason} />
}

function NewPayrunJobRow() {
  const { t } = useTranslation();
  const row = <Row icon={<Add fontSize="small" />} title={t("New payrun")} />;
  return <Button component={Link} to="new" variant="outlined" sx={{ p: 0, justifyContent: "start" }} >{row}</Button>
}

function Row({ title, subtitle, buttons, icon, bgcolor }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" minHeight={50} px={2} py={1} bgcolor={bgcolor}>
      {icon}
      <Stack direction={{ sm: "row" }} flex={1} spacing={1} alignItems={{ sm: "center" }} >
        <Typography>{title}</Typography>
        <Typography variant="caption">{subtitle}</Typography>
      </Stack>
      {buttons}
    </Stack>
  );
}

function useChangeStatus(payrunJobId) {
  const submit = useSubmit();
  const changeStatus = newStatus => submit({ status: newStatus, type: "change_status", jobId: payrunJobId }, { method: "post", encType: "application/json" });
  return { abort: () => changeStatus("Abort"), complete: () => changeStatus("Complete") };
}

function JobIcon({ payrunJob }) {
  const { t } = useTranslation();
  let Icon = null;
  let color = "action";
  switch (payrunJob.jobStatus) {
    case "Draft":
      Icon = Mode;
      break;
    case "Release":
      Icon = Outbox;
      color = "success";
      break;
    case "Process":
      Icon = SyncAlt;
      color = "success";
      break;
    case "Complete":
      Icon = DoneAll;
      color = "success";
      break;
    case "Forecast":
      Icon = InsightsRounded;
      color = "secondary";
      break;
    case "Abort":
      Icon = Cancel;
      color = "error";
      break;
    case "Cancel":
      Icon = DangerousRounded;
      color = "error";
      break;
  }
  if (Icon === null) return null;
  return <Tooltip title={t("PayrunJobStatus." + payrunJob.jobStatus)}><Icon fontSize="small" color={color} /></Tooltip>
}
