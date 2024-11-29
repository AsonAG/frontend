import React, { useMemo, useState } from "react";
import { ContentLayout, PageHeaderTitle } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useRouteLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowUpward, Cancel, ChevronLeft, Download } from "@mui/icons-material";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { Employee } from "../models/Employee";
import { IdType } from "../models/IdType";
import { getRowGridProps } from "./Dashboard";

export type Payouts = {
  id: IdType,
  entries: Array<Payout>
}

type Payout = {
  employeeId: IdType
  amount: number
}

export function Payouts() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  const onDelete = (payoutsId: IdType) => {
    return () => {
      const key = `payout_${payrunPeriod.id}_${payoutsId}`;
      console.log(key)
      localStorage.removeItem(key)
      rerender();
    }
  }
  const rerender = React.useReducer(() => ({}), {})[1]
  if (payrunPeriod.periodStatus !== "Open") {
    return <Navigate to=".." relative="path" />
  }

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
          {getPayouts(payrunPeriod.id).map(payouts => <PayoutsSection key={payouts.id} payouts={payouts} onDelete={onDelete(payouts.id)} />)}
        </Stack>
      </ContentLayout>
    </>
  )
}


const rowGridProps = getRowGridProps([200, 150, Number.MAX_SAFE_INTEGER, 75, 80])

function PayoutsSection({ payouts, onDelete }: { payouts: Payouts, onDelete: () => void }) {
  const { t } = useTranslation();
  const total = payouts.entries.reduce((a, b) => a + b.amount, 0);
  return (
    <Box {...rowGridProps}>
      <Typography>CH93 0076 2011 6238 5295 7</Typography>
      <Typography fontWeight="bold">{formatValue(total)} CHF</Typography>
      <Typography variant="subtitle1">{payouts.entries.length}</Typography>
      <Typography variant="subtitle1">{dayjs().format("L")}</Typography>
      <Stack direction="row" spacing={0.5}>
        <IconButton component="a" href={payouts.id} download={`PainFile_${dayjs().format("YYYYMMDD")}.xml`}><Download /></IconButton>
        <IconButton onClick={onDelete}><Cancel /></IconButton>
      </Stack>
    </Box>
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

export function getPayouts(payrunPeriodId: IdType): Array<Payouts> {
  return Object.keys(localStorage).filter(key => key.startsWith(`payout_${payrunPeriodId}`)).map(key => {
    const entries = JSON.parse(localStorage.getItem(key)!);
    const id = key.substring(44); // payout_81ef1bb8-4de1-4f88-aa8a-b23500f31a50_ => 44
    return {
      id,
      entries
    }
  })
}

export function createPayout(payrunPeriodId: IdType, entries: Array<Payout>) {
  const guid = self.crypto.randomUUID();
  const key = `payout_${payrunPeriodId}_${guid}`;
  localStorage.setItem(key, JSON.stringify(entries));
}
