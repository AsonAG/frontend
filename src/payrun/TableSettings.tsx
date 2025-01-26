import { Settings } from "@mui/icons-material";
import { FormControlLabel, FormGroup, IconButton, IconButtonProps, Stack, Switch, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import * as Popover from '@radix-ui/react-popover';
import React from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { useContainerWidthSetting } from "../App";

const jsonLocalStorage = createJSONStorage<ColumnVisibility>(() => localStorage);

const defaultColumnVisibility: ColumnVisibility = {
  identifier: true,
  employee: false,
  employerCost: true,
  offsetting: false,
  grossPreviousPeriod: false,
  grossDiff: false,
  openWagePayoutPreviousPeriod: false,
  garnishment: false,
  openGarnishmentPayoutPreviousPeriod: false,
  retro: false
}

export const columnVisibilityAtom = atomWithStorage<ColumnVisibility>("setting.dashboard.table.columnVisibility", defaultColumnVisibility, jsonLocalStorage, { getOnInit: true });

export type ColumnVisibility = {
  identifier: boolean
  employee: boolean
  employerCost: boolean
  offsetting: boolean
  grossPreviousPeriod: boolean
  grossDiff: boolean
  openWagePayoutPreviousPeriod: boolean
  garnishment: boolean
  openGarnishmentPayoutPreviousPeriod: boolean
  retro: boolean
}
const popoverSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  bgcolor: theme => theme.palette.background.default,
  overflow: "hidden",
  zIndex: theme => theme.zIndex.appBar
};

export const TableSettingsButton = React.forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton size="small" ref={ref} {...props}>
          <Settings fontSize="small" />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content asChild align="end">
          <Stack spacing={2} borderRadius={2} mx={2} p={2} sx={popoverSx} alignItems="start">
            <ColumnVisibilitySection />
            <FullWidthTableSection />
          </Stack>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>

  )
})

function FullWidthTableSection() {
  const { t } = useTranslation();
  const [fullWidth, setFullWidth] = useContainerWidthSetting("payrunperiodview");
  return (
    <Stack>
      <Typography variant="h6">{t("Table width")}</Typography>
      <FormGroup sx={{ pl: 0.5 }}>
        <FormControlLabel
          control={
            <Switch
              checked={fullWidth}
              onChange={(_, checked) => setFullWidth(checked)}
              size="small"
            />
          }
          label={t("Full width")}
        />
      </FormGroup>
    </Stack>
  );
}

function ColumnVisibilitySection() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Typography variant="h6">{t("Column visibility")}</Typography>
      <FormGroup sx={{ pl: 0.5 }}>
        <ColumnVisibilitySwitch column="identifier" label={t("Id")} tooltip={t("Id of the employee")} disabledColumn="employee" />
        <ColumnVisibilitySwitch column="employee" label={t("Name")} tooltip={t("Last name and first name of the employee")} disabledColumn="identifier" />
        <ColumnVisibilitySwitch column="employerCost" label={t("Total cost")} tooltip={t("Total costs from the employer's perspective")} />
        <ColumnVisibilitySwitch column="grossPreviousPeriod" label={t("Gross PP")} tooltip={t("Gross wage from previous period")} />
        <ColumnVisibilitySwitch column="grossDiff" label={t("Diff. gross")} tooltip={t("Gross wage previous period minus gross wage open period")} />
        <ColumnVisibilitySwitch column="offsetting" label={t("OT")} tooltip={t("Offsettings, i.e. supplements and deductions after the net wage")} />
        <ColumnVisibilitySwitch column="retro" label={t("Retro")} tooltip={t("Net amount from all retroactive changes prior to the open period")} />
        <ColumnVisibilitySwitch column="openGarnishmentPayoutPreviousPeriod" label={t("GPP")} tooltip={t("Garnishments to be paid from the previous period")} />
        <ColumnVisibilitySwitch column="openWagePayoutPreviousPeriod" label={t("OPP")} tooltip={t("Outstanding amount to be paid from the previous period")} />
        <ColumnVisibilitySwitch column="garnishment" label={t("Garnishment")} tooltip={t("Garnishment open period")} />
      </FormGroup>
    </Stack>
  )
}

function ColumnVisibilitySwitch({ column, label, tooltip, disabledColumn }: { column: keyof ColumnVisibility, label: string, tooltip: string, disabledColumn?: keyof ColumnVisibility }) {
  const [columnVisibility, setColumnVisibility] = useAtom(columnVisibilityAtom);
  const disabled = disabledColumn && !columnVisibility[disabledColumn];
  return <Tooltip title={tooltip} followCursor>
    <FormControlLabel
      control={
        <Switch
          checked={columnVisibility[column]}
          onChange={(_, checked) => setColumnVisibility({ ...columnVisibility, [column]: checked })}
          disabled={disabled}
          size="small"
        />
      }
      label={label}
    />
  </Tooltip>
}
