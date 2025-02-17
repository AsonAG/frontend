import { Chip, Divider, Stack } from "@mui/material"
import React, { Dispatch, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PayrollTableAction, PayrollTableState, TableGroup } from "./Dashboard"

type FilterBarProps = {
  state: PayrollTableState,
  dispatch: Dispatch<PayrollTableAction>
}

export function FilterBar({ state, dispatch }: FilterBarProps) {
  const { t } = useTranslation();
  const { rowFilter, group } = state;
  const salaryTypes = useMemo(() => [...new Set(state.entries.map(x => x.salaryType))].filter(Boolean).sort(), [state.entries]);

  const chips = useMemo(() => {
    return (
      <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33, pb: 0.5 }}>
        <GroupChip label={t("payrun_period_controlling")} group="Controlling" state={state} dispatch={dispatch} />
        <GroupChip label={t("payrun_period_ready")} group="Payable" state={state} dispatch={dispatch} />
        <GroupChip label={t("payrun_period_calculating")} group="Calculating" state={state} dispatch={dispatch} />
        <GroupChip label={t("payrun_period_paid_out")} group="PaidOut" state={state} dispatch={dispatch} />
        <GroupChip label={t("payrun_period_without_occupation")} group="WithoutOccupation" state={state} dispatch={dispatch} />
        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.75 }} />
        {
          salaryTypes.map(salaryType => (
            <FilterBarChip key={salaryType} label={salaryType!} isSelected={salaryType === rowFilter} onClick={() => dispatch({ type: "set_filter", filter: salaryType! })} />
          ))
        }
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
function GroupChip({ label, group, state, dispatch }: GroupChipProps) {
  const count = (state.entryStateGroups[group] ?? []).length;
  return (
    <FilterBarChip label={label + ` (${count})`} isSelected={group === state.group} onClick={() => dispatch({ type: "set_group", group })} />
  )
}

type FilterModeChip = {
  label: string,
  isSelected: boolean,
  onClick: () => void
}
function FilterBarChip({ label, isSelected, onClick }: FilterModeChip) {
  return (
    <Chip
      label={label}
      variant={isSelected ? "filled" : "outlined"}
      size="small"
      onClick={onClick}
      color="primary" />
  );
}
