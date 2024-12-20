import React, { forwardRef, Suspense } from "react";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Await, LinkProps, Link as RouterLink, useAsyncValue, useLoaderData } from "react-router-dom";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { QueryResult } from "../models/QueryResult";
import { PaginatedContent } from "../components/PaginatedContent";
import { Divider, Paper, Skeleton, Stack, styled, Typography } from "@mui/material";
import { ErrorView } from "../components/ErrorView";
import dayjs from "dayjs";

const Link = styled(
  forwardRef<HTMLAnchorElement, LinkProps>(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  }),
)(({ theme }) => {
  return {
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.hover,
    },
  };
});

export function PayrunPeriodList() {
  const { t } = useTranslation();
  return (
    <ContentLayout title={t("Payrolls")}>
      <Stack spacing={2}>
        <Typography variant="h6">{t("Open period")}</Typography>
        <AwaitOpenPayrunPeriod />
        <Typography variant="h6">{t("Closed periods")}</Typography>
        <AwaitClosedPayrunPeriods />
      </Stack>
    </ContentLayout>
  )
}
function AwaitClosedPayrunPeriods() {
  const { closedPayrunPeriods } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton />}>
      <Await resolve={closedPayrunPeriods} errorElement={<ErrorView />}>
        <ClosedPayrunPeriods />
      </Await>
    </Suspense>
  );
}

function AwaitOpenPayrunPeriod() {
  const { openPayrunPeriod } = useLoaderData();
  return (
    <Suspense fallback={<Skeleton><Row /></Skeleton>}>
      <Await resolve={openPayrunPeriod} errorElement={<ErrorView />}>
        <OpenPayrunPeriod />
      </Await>
    </Suspense>
  );
}

function OpenPayrunPeriod() {
  const openPayrunPeriod = useAsyncValue() as PayrunPeriod;
  const periodDate = dayjs.utc(openPayrunPeriod.periodStart).format("MMMM YYYY");
  return (
    <Paper variant="outlined">
      <Row
        title={periodDate}
        to="open"
      />
    </Paper>
  );
}

function ClosedPayrunPeriods() {
  const payrunPeriods = useAsyncValue() as QueryResult<PayrunPeriod>;
  if (payrunPeriods.count === 0) {
    return null;
  }
  return (
    <PaginatedContent>
      <Paper variant="outlined">
        <Stack divider={<Divider flexItem />}>
          {payrunPeriods.items.map((period) => {
            const periodDate = dayjs.utc(period.periodStart).format("MMMM YYYY");
            return <Row key={period.id} title={periodDate} to={period.id} />
          })}
        </Stack>
      </Paper>
    </PaginatedContent>
  );

}

function Row({ title, subtitle, to, buttons, icon, bgcolor }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      minHeight={50}
      px={2}
      py={1}
      bgcolor={bgcolor}
      component={Link}
      to={to}
      relative="path"
    >
      {icon}
      <Stack
        direction={{ sm: "row" }}
        flex={1}
        spacing={1}
        alignItems={{ sm: "center" }}
      >
        <Typography>{title}</Typography>
        <Typography variant="caption">{subtitle}</Typography>
      </Stack>
      {buttons}
    </Stack>
  );
}
