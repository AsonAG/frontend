import React from "react";
import { ContentLayout, PageHeaderTitle } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, useLoaderData, useParams, useRouteLoaderData, useSubmit } from "react-router-dom";
import dayjs from "dayjs";
import { Box, Chip, IconButton, Stack, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { Cancel, ChevronLeft, Download } from "@mui/icons-material";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { Employee } from "../models/Employee";
import { IdType } from "../models/IdType";
import { getRowGridProps } from "./Dashboard";
import { requestPainFileDownload } from "../api/FetchClient";

export type Payout = {
  id: IdType
  status: "Active" | "Inactive"
  valueDate: Date
  accountIban: string
  entries: Array<PayoutEntry>
}

type PayoutEntry = {
  employeeId: IdType
  amount: number
}

type RouteLoaderData = {
  payrunPeriod: PayrunPeriod
}

export function Payouts() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as RouteLoaderData;
  const payouts = useLoaderData() as Array<Payout>;
  const submit = useSubmit();

  return (
    <>
      <ContentLayout title={<PeriodSection />}>
        <Typography variant="h6">{t("Payouts")}</Typography>
        <Stack>
          <Box {...rowGridProps}>
            <Typography fontWeight="bold">{t("Bank account")}</Typography>
            <Typography fontWeight="bold">{t("Amount")}</Typography>
            <Typography fontWeight="bold">{t("Employees")}</Typography>
            <Typography fontWeight="bold">{t("Value date")}</Typography>
          </Box>
          {payouts.map(payout => <PayoutSection key={payout.id} payout={payout} onCancel={() => {
            const formData = new FormData();
            formData.set("payrunPeriodId", payrunPeriod.id);
            formData.set("payoutId", payout.id);
            submit(formData, { method: "post" });
          }} />)}
        </Stack>
      </ContentLayout>
    </>
  )
}


const rowGridProps = getRowGridProps([200, 150, Number.MAX_SAFE_INTEGER, 75, 80])
const inactiveSx: SxProps<Theme> = {
  textDecoration: "line-through",
  backgroundColor: theme => theme.palette.action.disabledBackground
}

function PayoutSection({ payout, onCancel }: { payout: Payout, onCancel: () => void }) {
  const { t } = useTranslation();
  const params = useParams();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as RouteLoaderData;
  const total = payout.entries.reduce((a, b) => a + b.amount, 0);
  const download = async () => {
    await requestPainFileDownload({ ...params, payrunPeriodId: payrunPeriod.id, payoutId: payout.id }, getPayoutFileName(payout));
  }
  const isCancelled = payout.status === "Inactive";
  const sx = isCancelled ? inactiveSx : {};
  return (
    <Tooltip title={isCancelled ? t("Cancelled") : null} followCursor>
      <Box {...rowGridProps} sx={sx}>
        <Typography>{payout.accountIban}</Typography>
        <Typography fontWeight="bold">{formatValue(total)} CHF</Typography>
        <Typography variant="subtitle1">{payout.entries.length}</Typography>
        <Typography variant="subtitle1">{dayjs(payout.valueDate).format("L")}</Typography>
        {!isCancelled &&
          <Stack direction="row" spacing={0.5}>
            <IconButton onClick={download}><Download /></IconButton>
            <IconButton onClick={onCancel}><Cancel /></IconButton>
          </Stack>
        }
      </Box>
    </Tooltip>
  )
}
const formatter = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function formatValue(value: number | null | undefined) {
  if (!value)
    return null;
  return formatter.format(value);
}

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
}

function PeriodSection() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  const periodDate = dayjs.utc(payrunPeriod.periodStart).format("MMMM YYYY");
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton component={Link} to=".." relative="path"><ChevronLeft /></IconButton>
        <PageHeaderTitle title={periodDate} />
      </Stack>
      <Chip color="success" size="small" label={t("Offen")} />
    </Stack>
  );
}

export function getPayoutFileName(payout: Payout) {
  return `PainFile_${dayjs(payout.valueDate).format("YYYYMMDD")}_${payout.id.substring(0, 8)}.xml`;
}
