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
import { requestPainFileDownload } from "../api/FetchClient";
import { getRowGridSx } from "./utils";

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
          <Box sx={defaultSx}>
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


const defaultSx = {
  ...getRowGridSx([{ width: 200 }, { width: 150 }, { width: 150, flex: 1 }, { width: 75, }, { width: 80 }], 2),
  alignItems: "center"
}
const inactiveSx: SxProps<Theme> = {
  ...defaultSx,
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
  return (
    <Tooltip title={isCancelled ? t("Cancelled") : null} followCursor>
      <Box sx={isCancelled ? inactiveSx : defaultSx}>
        <Typography>{payout.accountIban}</Typography>
        <Typography fontWeight="bold">{formatValue(total)} CHF</Typography>
        <Typography variant="subtitle1">{payout.entries.length}</Typography>
        <Typography variant="subtitle1">{dayjs(payout.valueDate).format("L")}</Typography>
        {!isCancelled &&
          <Stack direction="row" spacing={0.5}>
            <IconButton onClick={download} size="small"><Download /></IconButton>
            <IconButton onClick={onCancel} size="small"><Cancel /></IconButton>
          </Stack>
        }
      </Box>
    </Tooltip >
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
