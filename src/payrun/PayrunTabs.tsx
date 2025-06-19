import { Stack, Typography } from "@mui/material"
import React, { PropsWithChildren, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PayrollTableContext } from "./Dashboard"
import { TabButton } from "../components/TabLink"
import { useRouteLoaderData } from "react-router-dom"
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData"

export type Tab = "Controlling" | "Payable" | "PaidOut";

export function PayrunTabs() {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2} px={1} alignSelf="end" >
      <PayrunTab label={t("payrun_period_controlling")} tab="Controlling" />
      <PayrunTab label={t("payrun_period_ready")} tab="Payable" />
      <PayrunTab label={t("payrun_period_paid_out")} tab="PaidOut" />
    </Stack>
  );
}

type PayrunTabProps = {
  label: string
  tab: Tab
}

function PayrunTab({ label, tab }: PayrunTabProps) {
  const { state, dispatch } = useContext(PayrollTableContext);
  const { controllingData } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  let itemCount = state.entryCountByTab[tab]
  let badgeColor = "primary";
  if (tab === "Controlling") {
    itemCount += (controllingData.companyControllingCases.length > 0 ? 1 : 0);
    badgeColor = "warning";
  }
  return (
    <TabButton title={label} active={tab === state.selectedTab} badgeCount={itemCount} badgeColor={badgeColor} onClick={() => dispatch({ type: "set_tab", tab })} />
  )
}

export function PayrunTabContent({ tab, emptyText, children }: { tab: Tab, emptyText: string } & PropsWithChildren) {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  const { controllingData } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  if (tab !== state.selectedTab)
    return;

  let itemCount = state.entryCountByTab[tab]
  if (tab === "Controlling") {
    itemCount += (controllingData.companyControllingCases.length > 0 ? 1 : 0);
  }
  if (itemCount === 0) {
    const text = state.employeeFilter ? "No matches." : emptyText;
    return <Typography>{t(text)}</Typography>
  }
  return children;
}
