import { Chip, CircularProgress, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { Popover, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PayrollTableContext } from "./Dashboard";
import { getEmployeeDisplayString } from "../models/Employee";

export function CalculatingIndicator() {
  const { t } = useTranslation();
  const { state } = useContext(PayrollTableContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const entriesBeingCalculated = state.entriesByState["Calculating"];
  if (!entriesBeingCalculated)
    return;

  return <>
    <CircularProgress size={20} onMouseOver={handlePopoverOpen} onMouseLeave={handlePopoverClose} sx={{ alignSelf: "center" }} />
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
      <Stack spacing={1} sx={{ p: 2 }} alignItems="start">
        <Typography variant="h6">{t("Being calculated...")}</Typography>
        {entriesBeingCalculated.map(entry => <Chip key={entry.id} label={getEmployeeDisplayString(entry)} variant="outlined" />)}
      </Stack>
    </Popover>
  </>
}
