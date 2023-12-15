import { Suspense } from "react";
import { Loading } from "../components/Loading";
import { ErrorView } from "../components/ErrorView";
import { Await, useLoaderData } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function AsyncDataRoute({ children, loadingElement, skipDataCheck }) {
  const routeData = useLoaderData();
  const { t } = useTranslation();
  const loading = loadingElement || <Loading />;
  return (
    <Suspense fallback={loading}>
      <Await resolve={routeData.data} errorElement={<ErrorView />}>
        {(data) => skipDataCheck || hasData(data) ? children : <Typography>{t("No data available")}</Typography>}
      </Await>
    </Suspense>
  );
}

function hasData(value) {
  console.log(value);
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value.count > 0;
}
