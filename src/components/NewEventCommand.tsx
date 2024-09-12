import { Command } from "cmdk";
import React, { Suspense, useEffect, useState } from "react";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTitle, ResponsiveDialogTrigger } from "./ResponsiveDialog";
import { Box, Button, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { employeeAtom, payrollAtom } from "../utils/dataAtoms";

export function NewEventCommand() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ px: 1, tabIndex: -1 }} disableRipple>
          <Add sx={{ mr: 0.5, pb: 0.125 }} />
          Neues Ereignis...
          <Box component="div" sx={{
            borderWidth: "thin",
            borderStyle: "solid",
            borderRadius: 1,
            px: 0.5,
            ml: 2,
            fontSize: "0.6rem",
            borderColor: theme => theme.palette.common.white
          }}>CTRL+K</Box>
        </Button>
      </ResponsiveDialogTrigger>
      <Suspense>
        <NewEventDialogContent />
      </Suspense>
    </ResponsiveDialog>
  );
};

function NewEventDialogContent() {
  const { t } = useTranslation();
  const payroll = useAtomValue(payrollAtom);
  const employee = useAtomValue(employeeAtom);
  return (
    <ResponsiveDialogContent>
      <ResponsiveDialogTitle asChild>
        <Typography variant="h6">{t("What do you want to report?")}</Typography>
      </ResponsiveDialogTitle>
      <Command label="Global Command Menu">
        <Command.Input placeholder={t("Report this")} />
        <Command.List>
          <Command.Empty>{t("No event found.")}</Command.Empty>

          <Command.Group heading="Letters">
            <Command.Item>a</Command.Item>
            <Command.Item>b</Command.Item>
            <Command.Separator />
            <Command.Item>x</Command.Item>
          </Command.Group>

          <Command.Item>Apple</Command.Item>
          <Command.Item>c</Command.Item>
          <Command.Item>d</Command.Item>
          <Command.Item>e</Command.Item>
          <Command.Item>f</Command.Item>
          <Command.Item>g</Command.Item>
          <Command.Item>h</Command.Item>
          <Command.Item>i</Command.Item>
          <Command.Item>j</Command.Item>
        </Command.List>
      </Command>
    </ResponsiveDialogContent>
  )

}
