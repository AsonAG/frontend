import { Form, Link, useMatches, useRouteLoaderData } from "react-router-dom";
import { Employee } from "../models/Employee";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { AvailableCase } from "../models/AvailableCase";
import dayjs from "dayjs";
import React from "react";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { PageHeaderTitle } from "../components/ContentLayout";
import { ChevronLeft, NextPlan, PriceCheck, Receipt, Refresh } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingTasks: Array<Array<AvailableCase>>
}

type DashboardHeaderProps = {
  backlinkPath: string
}

export function DashboardHeader({ backlinkPath }: DashboardHeaderProps) {
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  const periodDate = dayjs.utc(payrunPeriod.periodStart).format("MMMM YYYY");
  return (
    <Stack direction="row" spacing={1} alignItems="center" width="100%" pr={0.5}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton component={Link} to={backlinkPath} relative="path"><ChevronLeft /></IconButton>
        <PageHeaderTitle title={periodDate} />
      </Stack>
      {payrunPeriod.periodStatus === "Open" ?
        <OpenPeriodHeaderParts /> :
        <ClosedPeriodHeaderParts />
      }
    </Stack>
  );
}

function OpenPeriodHeaderParts() {
  const matches = useMatches();
  const isReview = matches.some(m => m.id === "payrunperiodreview");
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  return (
    <>
      <Chip color="success" size="small" label={t("Offen")} />
      {
        !isReview && <>
          <Form method="post">
            <input type="hidden" name="payrunPeriodId" value={payrunPeriod.id} />
            <IconButton type="submit" color="primary" size="small" name="intent" value="calculate"><Refresh /></IconButton>
          </Form>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={t("Payouts")}>
            <IconButton component={Link} to="payouts"><PriceCheck /></IconButton>
          </Tooltip>
          <Tooltip title={t("Go to period completion...")}>
            <IconButton component={Link} to="review" color="primary"><NextPlan /></IconButton>
          </Tooltip>
        </>
      }
    </>
  )
}

function ClosedPeriodHeaderParts() {
  const { t } = useTranslation();
  const matches = useMatches();
  const isDocumentView = matches.some(m => m.id === "payrunperioddocuments");
  if (isDocumentView)
    return;
  return (
    <>
      <Box sx={{ flex: 1 }} />
      <Tooltip title={t("Documents")}>
        <IconButton component={Link} to="documents"><Receipt /></IconButton>
      </Tooltip>
    </>
  )
}

