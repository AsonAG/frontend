import { React } from "react";
import { useAsyncValue, Link } from "react-router-dom";
import { Stack, Card, CardHeader, CardActions, Button } from "@mui/material";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";

export function AsyncPayrunView() {
  return (
    <AsyncDataRoute skipDataCheck>
      <PayrunView />
    </AsyncDataRoute>
  );
}

function PayrunView() {
  const draftPayruns = useAsyncValue();

  const hasDraftPayrun = !draftPayruns;
  const payrunActionArea = hasDraftPayrun ? null : <NewPayrunView />
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
