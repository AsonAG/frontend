import { Button, Stack, Tooltip } from "@mui/material";
import React from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import { DataTable } from "./tables/DataTable";
import { Warning } from "@mui/icons-material";
import { MissingData } from "../models/MissingData";
import { useTranslation } from "react-i18next";

export function DataView() {
  return (
    <Stack spacing={2}>
      <MissingDataButtons />
      <DataTable />
    </Stack>
  )
}

type LoaderData = {
  missingData?: MissingData
}

function MissingDataButtons() {
  const { t } = useTranslation();
  const { missingData } = useRouteLoaderData("employee") as LoaderData ?? {}; // only display employee missing data

  if (!missingData) {
    return;
  }

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title={t("Missing data")}>
        <Warning color="warning" sx={{ height: 28, mr: 0.5 }} />
      </Tooltip>
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {missingData.cases?.map(_case => (
          <Button key={_case.id} component={Link} to={`../missingData/${encodeURIComponent(_case.name)}`} variant="outlined" color="warning" size="small">{_case.displayName}</Button>
        ))}
      </Stack>
    </Stack>
  );
}
