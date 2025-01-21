import { Button, Stack, Tooltip } from "@mui/material";
import React from "react";
import { Link, useLoaderData } from "react-router-dom";
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
  const { missingData } = useLoaderData() as LoaderData;

  const missingDataCount = missingData?.cases?.length ?? 0;
  if (missingDataCount === 0) {
    return;
  }

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title={t("Missing data")}>
        <Warning color="warning" sx={{ height: 28, width: 23, mr: 0.25 }} />
      </Tooltip>
      <Stack direction="row" flexWrap="wrap" spacing={1}>
        {missingData?.cases?.map(_case => (
          <Button key={_case.id} component={Link} to={`../missingdata/${encodeURIComponent(_case.name)}`} variant="outlined" color="warning" size="small">{_case.displayName}</Button>
        ))}
      </Stack>
    </Stack>
  );
}
