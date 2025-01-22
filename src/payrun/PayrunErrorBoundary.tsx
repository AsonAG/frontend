import React from "react";
import { useTranslation } from "react-i18next";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorView } from "../components/ErrorView";
import { Centered } from "../components/Centered";
import { Stack } from "@mui/material";
import { Loading } from "../components/Loading";


export function PayrunErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Centered>
      <Stack spacing={2}>
        <Loading />
        {t("The open period is being created. Please refresh the page in a moment.")}
      </Stack>
    </Centered>
  }

  return <ErrorView />
}
