import { Suspense } from "react";
import { Loading } from "../components/Loading";
import { ErrorView } from "../components/ErrorView";
import { Await, useLoaderData } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function AsyncDataRoute({ children }) {
  const routeData = useLoaderData();
  const { t } = useTranslation();
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={routeData.data} errorElement={<ErrorView />}>
        {(data) => hasData(data) ? children : <Typography>{t("No data available")}</Typography>}
      </Await>
    </Suspense>
  );
}

function hasData(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value.count > 0;
}
