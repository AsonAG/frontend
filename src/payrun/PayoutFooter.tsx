import { Button, Stack } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { PayoutDialog } from "./PayoutDialog";
import { formatValue, getStickySx } from "./utils";
import { useTranslation } from "react-i18next";

type PayoutFooterProps = {
  employeeCount: number
  totalPayingOut: number
  onPayout: (valutaDate: string, accountIban: string) => void
  minWidth?: number
} & PropsWithChildren

export function PayoutFooter({ employeeCount, totalPayingOut, onPayout, minWidth, children }: PayoutFooterProps) {
  const { t } = useTranslation();
  if (employeeCount === 0)
    return;
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
      {children}
      <Stack direction="row" justifyContent="end">
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
      </Stack>
    </Stack>
  )
}
