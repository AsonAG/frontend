import {
  useAsyncValue,
  useNavigate
} from "react-router-dom";
import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
} from "./ResponsiveDialog";
import { Close } from "@mui/icons-material";
import { formatDate } from "../utils/DateUtils";
import { useTranslation } from "react-i18next";
import { IdType } from "../models/IdType";
import { formatCaseValue } from "../utils/Format";

export function AsynCaseFieldHistoryDialog() {
  return (
    <AsyncDataRoute skipDataCheck>
      <CaseFieldHistoryDialog />
    </AsyncDataRoute>
  )
}

type CaseChangeCaseValue = {
  id: IdType,
  created: Date,
  value: string,
  caseFieldName: string
}

export function CaseFieldHistoryDialog() {
  const navigate = useNavigate();
  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate("..");
    }
  };

  return (
    <ResponsiveDialog open onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <Stack direction="row" spacing={2}>
          <Typography variant="h6" alignContent="center" flex={1}>History</Typography>
          <ResponsiveDialogClose>
            <IconButton>
              <Close />
            </IconButton>
          </ResponsiveDialogClose>
        </Stack>
        <Content />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function Content() {
  const caseValues = useAsyncValue() as Array<CaseChangeCaseValue>;
  const { t } = useTranslation();
  if (caseValues.length === 0)
    return <Typography>{t("No values saved")}</Typography>;

  return caseValues.map(cv => (
    <Stack direction="row" key={cv.id}>
      <Typography flex={1}>{formatCaseValue(cv, t)}</Typography>
      <Typography>{formatDate(cv.created, true)}</Typography>
    </Stack>
  ));
}
