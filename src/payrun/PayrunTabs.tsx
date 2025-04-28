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
      <PayrunControllingTab label={t("payrun_period_controlling")} />
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
  return (
    <TabButton title={label} active={tab === state.selectedTab} badgeCount={state.entryCountByTab[tab]} badgeColor="primary" onClick={() => dispatch({ type: "set_tab", tab })} />
  )
}

function PayrunControllingTab({ label }: { label: string }) {
  const tab: Tab = "Controlling";
  const { state, dispatch } = useContext(PayrollTableContext);
  const { controllingData } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const badgeCount = state.entryCountByTab[tab] + (controllingData.companyControllingCases.length > 0 ? 1 : 0);
  return (
    <TabButton title={label} active={tab === state.selectedTab} badgeCount={badgeCount} badgeColor="warning" onClick={() => dispatch({ type: "set_tab", tab })} />
  )
}

export function PayrunTabContent({ tab, emptyText, children }: { tab: Tab, emptyText: string } & PropsWithChildren) {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  if (tab !== state.selectedTab)
    return;
  if (state.entryCountByTab[tab] === 0) {
    const text = state.employeeFilter ? "No matches." : emptyText;
    return <Typography>{t(text)}</Typography>
  }
  return children;
}
