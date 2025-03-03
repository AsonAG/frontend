import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { Dispatch } from "react";
import { PayrunTableAction, PayrunTableState } from "./PayrollTable";
import { useTranslation } from "react-i18next";


type RowSelectionButtonProps = {
  state: PayrunTableState,
  dispatch: Dispatch<PayrunTableAction>
}

export function RowSelectionButton({ state, dispatch }: RowSelectionButtonProps) {
  const { t } = useTranslation();
  const checked = state.selectedEmployeeCount === state.fullSelectionCount;
  const indeterminate = state.selectedEmployeeCount > 0 && !checked;
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} indeterminate={indeterminate} size="small" onClick={() => dispatch({ type: "toggle_selected" })} />}
        label={`${state.selectedEmployeeCount} ${t("selected")}`} />
    </FormGroup>
  );
}
