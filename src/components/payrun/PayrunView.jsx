import { React, Suspense } from "react";
import { Link, useSubmit, useLoaderData, Await, Outlet, useOutlet, useAsyncValue } from "react-router-dom";
import { Stack, Button, Typography, Skeleton, Divider, IconButton, Tooltip, Paper } from "@mui/material";
import { Cancel, ChevronRight, Clear, DangerousRounded, DoneAll, InsightsRounded, Mode, Outbox, Stop, SyncAlt } from "@mui/icons-material";
import { ContentLayout } from "../ContentLayout";
import { ErrorView } from "../ErrorView";
import { useTranslation } from "react-i18next";

export function AsyncPayrunView() {
  const { t } = useTranslation();
  const outlet = useOutlet();
  return (
    <ContentLayout title={t("Payruns")}>
      {
        outlet ??
        <Stack spacing={2}>
          <DraftPayrun />
          <AwaitPayrunJobs />
        </Stack>
      }
    </ContentLayout>
  );
}

function AwaitPayrunJobs() {
  const { payrunJobs } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Await resolve={payrunJobs} errorElement={<ErrorView />}>
        <JobTable>
          <PayrunJobs />
        </JobTable>
      </Await>
    </Suspense>
  );
}


function JobTable({children}) {
  return (
    <Paper variant="outlined">
      <Stack divider={<Divider />}>
        {children}
      </Stack>
    </Paper>
  )
}

function PayrunJobs() {
  const jobs = useAsyncValue();
  return jobs.items.map(job => <PayrunJobRow key={job.id} payrunJob={job} />);
}

function DraftPayrun() {
  const { draftPayrunJobs } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Await resolve={draftPayrunJobs} errorElement={<ErrorView />}>
        {(drafts) => drafts.length > 0 ? <DraftPayrunJobRow payrunJob={drafts[0]} /> : <NewPayrunJobRow />}
      </Await>
    </Suspense>
  );
}

function DraftPayrunJobRow({payrunJob}) {
  const { abort, complete } = useChangeStatus(payrunJob.id);
  const { t } = useTranslation();
  const buttons = (
    <Stack direction="row">
      <Tooltip title={t("Abort")}>
        <IconButton color="error" size="small" onClick={abort}><Clear /></IconButton>
      </Tooltip>
      <Tooltip title={t("Release")}>
        <IconButton color="primary" size="small" onClick={complete}><DoneAll /></IconButton>
      </Tooltip>
    </Stack>
  );
  const icon = <JobIcon payrunJob={payrunJob} />;
  return <Row icon={icon} title={payrunJob.name} subtitle={payrunJob.reason} buttons={buttons} />
}

function PayrunJobRow({payrunJob}) {
  const icon = <JobIcon payrunJob={payrunJob} />
  return <Row icon={icon} title={payrunJob.name} subtitle={payrunJob.reason} />
}

function NewPayrunJobRow() {
  const { t } = useTranslation();
  const button = <IconButton size="small" component={Link} to="new"><ChevronRight fontSize="small"/></IconButton>;
  
  return <Row title={t("New payrun")} buttons={button} />
}

function Row({title, subtitle, buttons, icon}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" minHeight={32} px={1}>
      {icon}
      <Stack direction="row" flex={1} spacing={1} alignItems="center">
        <Typography>{title}</Typography>
        <Typography variant="caption">{subtitle}</Typography>
      </Stack>
      {buttons}
    </Stack>
  );
}

function useChangeStatus(payrunJobId) {
  const submit = useSubmit();
  const changeStatus = newStatus => submit({status: newStatus, type: "change_status", jobId: payrunJobId}, { method: "post", encType: "application/json" });
  return {abort: () => changeStatus("Abort"), complete: () => changeStatus("Complete")};
}

function JobIcon({payrunJob}) {
  const { t } = useTranslation();
  let Icon = null;
  switch(payrunJob.jobStatus) {
    case "Draft":
      Icon = Mode;
      break;
    case "Release":
      Icon = Outbox;
      break;
    case "Process":
      Icon = SyncAlt;
      break;
    case "Complete":
      Icon = DoneAll;
      break;
    case "Forecast":
      Icon = InsightsRounded;
      break;
    case "Abort":
      Icon = Cancel;
      break;
    case "Cancel":
      Icon = DangerousRounded;
      break;
  }
  if (Icon === null) return null;
  return <Tooltip title={t(payrunJob.jobStatus)}><Icon fontSize="small" color="action" /></Tooltip>
}