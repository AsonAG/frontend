import { Stack } from "@mui/material"
import React, { Dispatch, useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PayrollTableAction, PayrollTableContext, PayrollTableState, TableGroup } from "./Dashboard"
import { TabButton } from "../components/TabLink"

export function GroupTabs() {
  const { state, dispatch } = useContext(PayrollTableContext);
  const { t } = useTranslation();
  const { rowFilter, group } = state;

  const chips = useMemo(() => {
    return (
      <Stack direction="row" spacing={2} flex={1} px={1} >
        <GroupTab label={t("payrun_period_controlling")} group="Controlling" state={state} dispatch={dispatch} />
        <GroupTab label={t("payrun_period_ready")} group="Payable" state={state} dispatch={dispatch} />
        <GroupTab label={t("payrun_period_paid_out")} group="PaidOut" state={state} dispatch={dispatch} />
      </Stack>
    )
  }, [group, rowFilter]);

  return chips;
}

type GroupChipProps = {
  label: string
  group: TableGroup
  state: PayrollTableState,
  dispatch: Dispatch<PayrollTableAction>
}
function GroupTab({ label, group, state, dispatch }: GroupChipProps) {
  let count = (state.entryStateGroups[group] ?? []).length;
  if (group === "Controlling") { // Temp fix
    count += (state.entryStateGroups["WithoutOccupation"] ?? []).length
  }
  return (
    <TabButton title={label} active={group === state.group} badgeCount={count} onClick={() => dispatch({ type: "set_group", group })} />
  )
}
