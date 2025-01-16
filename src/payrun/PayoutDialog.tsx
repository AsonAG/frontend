import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteLoaderData } from "react-router-dom";
import { DatePicker } from "../components/DatePicker";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import dayjs, { Dayjs } from "dayjs";
import { BankAccountDetails } from "./BankAccountDetails";
import { formatValue, getRowGridSx } from "./utils";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";

type PayoutDialogProps = {
  employeeCount: number,
  amount: number,
  onPayout: (valutaDate: string, accountIban: string) => void
} & PropsWithChildren


const dialogColumns = getRowGridSx([{ width: 120 }, { width: 150, flex: 1 }], 2);
export function PayoutDialog({ employeeCount, amount, onPayout, children }: PayoutDialogProps) {
  const { t } = useTranslation();
  const { bankAccountDetails } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  const [open, setOpen] = useState<boolean>(false);
  const [valueDate, setValueDate] = useState<Dayjs | null>(dayjs());
  const [valueDateValid, setValueDateValid] = useState<boolean>(true);
  const [bankAccount, setBankAccount] = useState<BankAccountDetails>(bankAccountDetails)

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }



  if (!React.isValidElement(children)) {
    return null;
  }

  const trigger = React.cloneElement(children, {
    ...children.props,
    onClick: handleOpen
  });

  return (
    <>
      {trigger}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Payout")}</DialogTitle>
        <DialogContent sx={{ width: "90vw", maxWidth: 500 }}>
          <Stack spacing={2}>
            <Box sx={dialogColumns}>
              <Typography>{t("Employee number")}</Typography>
              <Typography fontWeight="bold">{employeeCount}</Typography>
            </Box>
            <Box sx={dialogColumns}>
              <Typography>{t("Amount")}</Typography>
              <Typography fontWeight="bold">{formatValue(amount)} CHF</Typography>
            </Box>
            <Box sx={dialogColumns}>
              <Typography>{t("Bank account")}</Typography>
              <BankAccountSelector bankAccount={bankAccount} />
            </Box>
            <Box sx={dialogColumns}>
              <Typography>{t("Value date")}</Typography>
              <DatePicker variant="standard" disablePast value={valueDate} onChange={(v) => setValueDate(v)} onError={(e) => setValueDateValid(!e)}></DatePicker>
            </Box>
            <Stack direction="row" justifyContent="end" spacing={2}>
              <Button onClick={handleClose}>{t("Cancel")}</Button>
              <Button disabled={!valueDate || !valueDateValid || !bankAccount?.iban} variant="contained" onClick={() => onPayout(valueDate!.toISOString(), bankAccount.iban!)}>{t("Confirm")}</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

function BankAccountSelector({ bankAccount }: { bankAccount: BankAccountDetails }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{
      userSelect: "none",
      px: 1,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 1,
      borderColor: theme => `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.23)`,
      // cursor: "pointer",
      // "&:hover": {
      //   borderColor: theme => theme.palette.text.primary
      // }
    }}>
      <AccountBalanceIcon />
      <Stack>
        <Typography variant="subtitle2">{bankAccount.accountName}</Typography>
        <Typography variant="body2">{bankAccount.iban}</Typography>
      </Stack>
    </Stack>
  )
}
