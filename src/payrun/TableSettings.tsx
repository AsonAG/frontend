import { Settings } from "@mui/icons-material";
import { FormControlLabel, FormGroup, IconButton, Stack, Switch, SxProps, Theme, Typography } from "@mui/material";
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
  openPreviousPeriod: false,
  garnishment: false,
  openGarnishmentPreviousPeriod: false,
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
  openPreviousPeriod: boolean
  garnishment: boolean
  openGarnishmentPreviousPeriod: boolean
  retro: boolean
}
const popoverSx: SxProps<Theme> = {
  border: 1,
  borderColor: "divider",
  bgcolor: theme => theme.palette.background.default,
  overflow: "hidden",
  zIndex: theme => theme.zIndex.appBar
};

export function TableSettingsButton() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton size="small">
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
}

function FullWidthTableSection() {
  const { t } = useTranslation();
  const [fullWidth, setFullWidth] = useContainerWidthSetting("payrunperiodview");
  return (
    <Stack>
      <Typography variant="h6">{t("Table width")}</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={fullWidth}
              onChange={(_, checked) => setFullWidth(checked)}
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
      <FormGroup>
        <ColumnVisibilitySwitch column="identifier" label={t("Id")} disabledColumn="employee" />
        <ColumnVisibilitySwitch column="employee" label={t("Employee name")} disabledColumn="identifier" />
        <ColumnVisibilitySwitch column="employerCost" label={t("Gross wage plus employer cost")} />
        <ColumnVisibilitySwitch column="grossPreviousPeriod" label={t("Gross wage from previous period")} />
        <ColumnVisibilitySwitch column="grossDiff" label={t("Gross wage difference to previous period")} />
        <ColumnVisibilitySwitch column="offsetting" label={t("Offsetting")} />
        <ColumnVisibilitySwitch column="openPreviousPeriod" label={t("Open from previous period")} />
        <ColumnVisibilitySwitch column="garnishment" label={t("Garnishment")} />
        <ColumnVisibilitySwitch column="openGarnishmentPreviousPeriod" label={t("Garnishment from previous period")} />
        <ColumnVisibilitySwitch column="retro" label={t("Retro")} />
      </FormGroup>
    </Stack>
  )
}

function ColumnVisibilitySwitch({ column, label, disabledColumn }: { column: keyof ColumnVisibility, label: string, disabledColumn?: keyof ColumnVisibility }) {
  const [columnVisibility, setColumnVisibility] = useAtom(columnVisibilityAtom);
  const disabled = disabledColumn && !columnVisibility[disabledColumn];
  return <FormControlLabel
    control={
      <Switch
        checked={columnVisibility[column]}
        onChange={(_, checked) => setColumnVisibility({ ...columnVisibility, [column]: checked })}
        disabled={disabled}
      />
    }
    label={label}
  />
}
