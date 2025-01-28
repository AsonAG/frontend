import { Chip, Divider, Stack } from "@mui/material"
import React, { Dispatch, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PayrollTableAction, PayrollTableState } from "./Dashboard"

type FilterBarProps = {
  state: PayrollTableState,
  dispatch: Dispatch<PayrollTableAction>
}

export function FilterBar({ state, dispatch }: FilterBarProps) {
  const { t } = useTranslation();
  const { filter, filterGroups } = state;

  const chips = useMemo(() => {
    const { payable, ...rest } = filterGroups;
    return (
      <Stack direction="row" spacing={0.5} flex={1} sx={{ height: 33, pb: 0.5 }}>
        <FilterModeChip label={t("payrun_period_ready")} isSelected={filter === "payable"} onClick={() => dispatch({ type: "toggle_mode", mode: "payable" })} />
        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.75 }} />
        {
          Object.keys(rest).sort().map(group => (
            <FilterModeChip key={group} label={group} isSelected={filter === group} onClick={() => dispatch({ type: "toggle_mode", mode: group })} />
          ))
        }
      </Stack>
    )
  }, [filterGroups, filter]);

  return chips;
}

type FilterModeChip = {
  label: string,
  isSelected: boolean,
  onClick: () => void
}
function FilterModeChip({ label, isSelected, onClick }: FilterModeChip) {
  return (
    <Chip
      label={label}
      variant={isSelected ? "filled" : "outlined"}
      size="small"
      onClick={onClick}
      color="primary" />
  );
}
