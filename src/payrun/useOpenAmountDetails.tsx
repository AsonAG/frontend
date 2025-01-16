import { Box, Popover, Stack, Typography } from "@mui/material";
import { CellContext } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatValue, getRowGridSx } from "./utils";
import { EntryRow } from "./Dashboard";

type OpenAmountDetails = {
  hasDetails: boolean
  openPopover?: (event: React.MouseEvent<HTMLElement>) => void
  closePopover?: () => void
  popover?: React.ReactNode
}

export function useOpenAmountDetails(context: CellContext<EntryRow, number | null>): OpenAmountDetails {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const row = context.row.original.entry;
  const columnVisibility = context.table.getState().columnVisibility;

  if (!row) {
    return { hasDetails: false };
  }
  const offsetting = row.offsetting;
  const retro = row.retro;
  const openPreviousPeriod = row.openBalancePreviousPeriod;
  const garnishment = row.garnishment;
  const openGarnishmentPreviousPeriod = row.openGarnishmentPreviousPeriod;

  const offsettingHidden = !!(offsetting && !columnVisibility.offsetting);
  const openPreviousPeriodHidden = !!(openPreviousPeriod && !columnVisibility.openPreviousPeriod);
  const retroHidden = !!(retro && !columnVisibility.retro);
  const garnishmentHidden = !!(garnishment && !columnVisibility.garnishment);
  const openGarnishmentPreviousPeriodHidden = !!(openGarnishmentPreviousPeriod && !columnVisibility.openGarnishment);

  if (!offsettingHidden && !openPreviousPeriodHidden && !retroHidden && !garnishmentHidden && !openGarnishmentPreviousPeriodHidden) {
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
        <OpenDetailRow label={t("Net")} value={formatValue(context.row.original.entry?.netWage)} />
        {offsettingHidden && <OpenDetailRow label={t("Offsetting")} value={formatValue(context.row.original.entry?.offsetting)} />}
        {openPreviousPeriodHidden && <OpenDetailRow label={t("Open from previous period")} value={formatValue(context.row.original.entry?.openBalancePreviousPeriod)} />}
        {retroHidden && <OpenDetailRow label={t("Retro")} value={formatValue(context.row.original.entry?.retro)} />}
        {garnishmentHidden && <OpenDetailRow label={t("Garnishment")} value={formatValue(context.row.original.entry?.garnishment)} />}
        {openGarnishmentPreviousPeriodHidden && <OpenDetailRow label={t("Garnishment")} value={formatValue(context.row.original.entry?.openGarnishmentPreviousPeriod)} />}
        <OpenDetailRow label={t("Open")} value={formatValue(context.row.original.entry?.open)} />
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

const openDetailColumns = getRowGridSx([{ width: 150 }, { width: 100 }], 2);

