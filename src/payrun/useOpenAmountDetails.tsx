import { Box, Popover, Stack, Typography } from "@mui/material";
import { CellContext } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatValue, getRowGridSx } from "./utils";
import { EntryRow } from "./types";

type OpenAmountDetails = {
  hasDetails: boolean
  openPopover?: (event: React.MouseEvent<HTMLElement>) => void
  closePopover?: () => void
  popover?: React.ReactNode
}

export function useOpenAmountDetails(context: CellContext<EntryRow, number | null>): OpenAmountDetails {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const row = context.row.original;
  const columnVisibility = context.table.getState().columnVisibility;

  if (!row) {
    return { hasDetails: false };
  }
  const offsetting = row.offsetting;
  const retro = row.retro;
  const openWagePayoutPreviousPeriod = row.openWagePayoutPreviousPeriod;
  const garnishment = row.garnishment;
  const openGarnishmentPayoutPreviousPeriod = row.openGarnishmentPayoutPreviousPeriod;

  const offsettingHidden = !!(offsetting && !columnVisibility.offsetting);
  const openWagePayoutPreviousPeriodHidden = !!(openWagePayoutPreviousPeriod && !columnVisibility.openWagePayoutPreviousPeriod);
  const retroHidden = !!(retro && !columnVisibility.retro);
  const garnishmentHidden = !!(garnishment && !columnVisibility.garnishment);
  const openGarnishmentPayoutPreviousPeriodHidden = !!(openGarnishmentPayoutPreviousPeriod && !columnVisibility.openGarnishmentPayoutPreviousPeriod);

  if (!offsettingHidden && !openWagePayoutPreviousPeriodHidden && !retroHidden && !garnishmentHidden && !openGarnishmentPayoutPreviousPeriodHidden) {
    return { hasDetails: false };
  }
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const popover = (
    <Popover
      elevation={1}
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={handlePopoverClose}
    >
      <Stack spacing={1} sx={{ p: 2 }}>
        <OpenDetailRow label={t("Net wage open period")} value={formatValue(context.row.original.netWage)} />
        {offsettingHidden && <OpenDetailRow label={t("Offsettings, i.e. supplements and deductions after the net wage")} value={formatValue(context.row.original.offsetting)} />}
        {openWagePayoutPreviousPeriodHidden && <OpenDetailRow label={t("Outstanding amount to be paid from the previous period")} value={formatValue(context.row.original.openWagePayoutPreviousPeriod)} />}
        {retroHidden && <OpenDetailRow label={t("Net amount from all retroactive changes prior to the open period")} value={formatValue(context.row.original.retro)} />}
        <OpenDetailRow label={t("Open")} value={formatValue(context.row.original.openPayout)} />
        {garnishmentHidden && <OpenDetailRow label={t("Garnishment open period")} value={formatValue(context.row.original.openGarnishmentPayout)} />}
        {openGarnishmentPayoutPreviousPeriodHidden && <OpenDetailRow label={t("Garnishments to be paid from the previous period")} value={formatValue(context.row.original.openGarnishmentPayoutPreviousPeriod)} />}
      </Stack>
    </Popover>
  );
  return {
    popover,
    hasDetails: true,
    openPopover: handlePopoverOpen,
    closePopover: handlePopoverClose
  }
}
function OpenDetailRow({ label, value }: { label: string, value: string | null }) {
  return (
    <Box sx={openDetailColumns}>
      <Typography>{label}</Typography>
      <Typography textAlign="right">{value}</Typography>
    </Box >
  )
}

const openDetailColumns = getRowGridSx([{ width: 310 }, { width: 100 }], 2);

