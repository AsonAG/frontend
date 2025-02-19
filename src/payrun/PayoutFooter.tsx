import { Button, Stack } from "@mui/material";
import React, { PropsWithChildren, useContext } from "react";
import { PayoutDialog } from "./PayoutDialog";
import { formatValue, getStickySx } from "./utils";
import { useTranslation } from "react-i18next";
import { PayrollTableContext } from "./Dashboard";

type PayoutFooterProps = {
  onPayout: (valutaDate: string, accountIban: string) => void,
  minWidth?: number
} & PropsWithChildren

export function PayoutFooter({ onPayout, minWidth, children }: PayoutFooterProps) {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  const employeeCount = Object.values(state.selected).filter(Boolean).length;
  const totalPayingOut = state.payoutTotals.payingOut;
  return (
    <Stack
      spacing={2}
      sx={{
        minWidth,
        ...getStickySx(40, { bottom: 0 }),
        py: 2,
        borderTop: 1,
        borderColor: theme => theme.palette.divider,
        backgroundColor: theme => theme.palette.background.default
      }}
    >
      {employeeCount > 0 && children}
      <Stack direction="row" justifyContent="end">
        {
          employeeCount === 0 ?
            <SelectAllButton /> :
            <PayoutDialog
              amount={totalPayingOut}
              employeeCount={employeeCount}
              onPayout={onPayout}>
              <Button variant="contained" disabled={totalPayingOut === 0} sx={getStickySx(40, { right: 0 })}>
                <Stack direction="row">
                  <span>{t("Payout")}:&nbsp;</span>
                  <span>{formatValue(totalPayingOut)}</span>
                  <span>&nbsp;CHF</span>
                </Stack>
              </Button>
            </PayoutDialog>
        }
      </Stack>
    </Stack>
  )
}

function SelectAllButton() {
  const { t } = useTranslation();
  const { dispatch } = useContext(PayrollTableContext);
  const onClick = () => {
    dispatch({ type: "select_all" });
  }
  return (
    <Button variant="contained" onClick={onClick} sx={getStickySx(40, { right: 0 })}>{t("Payout all")}</Button>
  )
}
