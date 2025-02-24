import React, { Dispatch, MouseEventHandler } from "react";
import { NumericFormat } from "react-number-format";
import { groupSeparator } from "./utils";
import { TextField } from "@mui/material";
import { EntryRow } from "./types";
import { PayrunTableAction } from "./PayrollTable";

type AmountInputProps = {
  entry: EntryRow
  dispatch: Dispatch<PayrunTableAction>
  onClick: MouseEventHandler
}

export function AmountInput({ entry, dispatch, onClick }: AmountInputProps) {
  if (!entry.openPayout)
    return;

  const handleChange = ({ floatValue }) => {
    dispatch({ type: "set_amount", id: entry.id, amount: floatValue });
  };

  const receiveFocus = () => {
    dispatch({ type: "set_selected", id: entry.id, selected: true });
  }

  return (
    <NumericFormat
      onClick={onClick}
      value={entry.amount}
      onValueChange={handleChange}
      onFocus={receiveFocus}
      valueIsNumericString
      thousandSeparator={groupSeparator ?? ""}
      decimalScale={2}
      fixedDecimalScale
      customInput={TextField}
      type="numeric"
      size="small"
      isAllowed={(values) => {
        const { floatValue } = values;
        return (floatValue ?? 0) <= (entry.openPayout ?? 0);
      }}
      slotProps={{
        htmlInput: {
          style: {
            textAlign: "right",
            padding: "4px 8px 4px 0"
          }
        }
      }}
    />
  );
}

