import { React } from "react";
import { useAsyncValue, Link, useSubmit } from "react-router-dom";
import { Stack, Card, CardHeader, CardActions, Button, Typography } from "@mui/material";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { Mode } from "@mui/icons-material";

export function AsyncPayrunView() {
  return (
    <AsyncDataRoute skipDataCheck>
      <PayrunView />
    </AsyncDataRoute>
  );
}

function PayrunView() {
  const draftPayruns = useAsyncValue();

  const hasDraftPayrun = draftPayruns.length > 0;
  const payrunActionArea = hasDraftPayrun ? 
    <DraftPayrunJobView draftPayrunJob={draftPayruns[0]} /> :
    <NewPayrunView />;
  
  return (
    <Stack spacing={2}>
      {payrunActionArea}
    </Stack>
  )
}

function NewPayrunView() {
  return (
    <Card>
      <CardHeader title="No active payrun found" />
      <CardActions>
        <Button component={Link} to="new" relative="path" variant="contained">Execute Payrun</Button>
      </CardActions> 
    </Card>
  );
}


function DraftPayrunJobView({draftPayrunJob}) {
  const submit = useSubmit();
  const changeStatus = newStatus => () => submit({status: newStatus, type: "change_status", jobId: draftPayrunJob.id}, { method: "post", encType: "application/json" });
  return (
    <Stack direction="row" spacing={2}>
      <Mode color="action" sx={{fontSize: "3.5em"}}/>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{draftPayrunJob.name} (Draft)</Typography>
          <Typography variant="body2">This payrun job is a draft.</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="text" color="error" onClick={changeStatus("Abort")}>Abort</Button>
          <Button variant="contained" onClick={changeStatus("Release")}>Release</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}