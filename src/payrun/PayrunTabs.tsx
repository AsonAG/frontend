import { Stack, Typography } from "@mui/material"
import React, { PropsWithChildren, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PayrollTableContext } from "./Dashboard"
import { TabButton } from "../components/TabLink"

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

type GroupChipProps = {
  label: string
  tab: Tab
}
function PayrunTab({ label, tab }: GroupChipProps) {
  const { state, dispatch } = useContext(PayrollTableContext);
  let count = (state.entriesByState[tab] ?? []).length;
  if (tab === "Controlling") {
    count += (state.entriesByState["WithoutOccupation"] ?? []).length
  }
  return (
    <TabButton title={label} active={tab === state.selectedTab} badgeCount={count} onClick={() => dispatch({ type: "set_tab", tab })} />
  )
}

export function PayrunTabContent({ tab, emptyText, children }: { tab: Tab, emptyText: string } & PropsWithChildren) {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  if (tab !== state.selectedTab)
    return;
  if (!state.entriesByState[tab]) {
    const text = state.employeeFilter ? "No matches." : emptyText;
    return <Typography>{t(text)}</Typography>
  }
  return children;
}
