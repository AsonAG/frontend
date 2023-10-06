import { Suspense } from "react";
import Header from "../components/Header";
import { Loading } from "../components/Loading";
import { ErrorView } from "../components/ErrorView";
import { useTranslation } from "react-i18next";
import { useOutletContext, Await, useLoaderData } from "react-router-dom";
import { Stack } from "@mui/material";

export function AsyncDataRoute({ defaultTitle, disableXsPadding, disableScaffold = false, children }) {
  const { t } = useTranslation();
  const title = useOutletContext() || defaultTitle;
  const routeData = useLoaderData();

  const stackSpacingProps = {xs: disableXsPadding ? 0 : 4, sm: 1, lg: 4};
  const headerSpacingProps = disableXsPadding ? {xs: 4, sm: 0} : {};

  const suspense = (
    <Suspense fallback={<Loading />}>
      <Await resolve={routeData.data} errorElement={<ErrorView />}>
        { children }
      </Await>
    </Suspense>
  );

  if (disableScaffold) {
    return suspense;
  }

  return (
    <Stack px={stackSpacingProps} py={4} spacing={2} sx={{ minHeight: "100%" }}>
      <Header title={t(title)} px={headerSpacingProps}/>
      {suspense}
    </Stack>
  );
}