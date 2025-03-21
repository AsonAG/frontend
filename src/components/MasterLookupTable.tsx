import { Alert, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import { LookupSet, LookupValue } from "../models/LookupSet";
import { IdType } from "../models/IdType";
import { Delete, Save } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "./ResponsiveDialog";

type LoaderData = {
  lookup: LookupSet
  regulationId: IdType
  keyName: string
  canDelete: (key: string) => [boolean, string]
}

export function MasterLookupTable() {
  const { lookup } = useLoaderData() as LoaderData;
  return (
    <Stack spacing={1}>
      <TableHeader />
      {lookup.values.map(value => <ValueRow key={value.id} value={value} />)}
      <NewValueRow />
    </Stack>
  )
}

function ValueRow({ value }: { value: LookupValue }) {
  const [lookupData, setLookupData] = useState(value ? { ...value } : { key: "", value: "" });

  const isDirty = lookupData.key !== value.key || lookupData.value !== value.value;
  const idElements = <HiddenIdElements value={value} />

  return (
    <Stack direction="row">
      <Form method={"PUT"} style={{ flex: 1 }}>
        {idElements}
        <Stack direction="row" spacing={1}>
          <TextField name="key" value={lookupData.key} sx={{ width: 120 }} size="small" disabled slotProps={{ htmlInput: { readOnly: true, disabled: false } }} />
          <TextField name="value" value={lookupData.value} onChange={e => setLookupData({ ...lookupData, value: e.target.value })} sx={{ flex: 1 }} size="small" />
          <IconButton type="submit" tabIndex={-1} color="primary" disabled={!isDirty}><Save /></IconButton>
        </Stack>
      </Form>
      <DeleteButton value={value}>
        {idElements}
      </DeleteButton>
    </Stack>
  )
}

function DeleteButton({ children, value }) {
  const { t } = useTranslation();
  const { canDelete } = useLoaderData() as LoaderData;
  const [deletable, reason] = useMemo(() => canDelete?.(value.key) ?? [true, null], [canDelete, value.key]);
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>
        <IconButton type="submit" tabIndex={-1}>
          <Delete />
        </IconButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <Typography variant="h6">{t("Delete value")}</Typography>
        <Typography>{t("Do you really want to delete this value?")}</Typography>
        <Typography>{value.key} {value.value}</Typography>
        {
          reason &&
          <Alert severity="error">
            <Typography>{t(reason)}</Typography>
          </Alert>
        }
        <Form method="DELETE">
          {children}
          <Stack direction="row" justifyContent="end" spacing={1}>
            <ResponsiveDialogClose>
              <Button>{t("Cancel")}</Button>
            </ResponsiveDialogClose>
            <Button type="submit" variant="contained" color="destructive" disabled={!deletable}>{t("Delete")}</Button>
          </Stack>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

function TableHeader() {
  const { t } = useTranslation();
  const { keyName } = useLoaderData() as LoaderData;
  return (
    <Stack direction="row" spacing={1}>
      <Typography fontWeight="bold" sx={{ width: 120 }}>{t(keyName)}</Typography>
      <Typography fontWeight="bold" sx={{ flex: 1 }}>{t("Description")}</Typography>
    </Stack>
  )

}

function NewValueRow() {
  const { t } = useTranslation();
  const actionData = useActionData() as { success: boolean } | undefined;
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [actionData]);

  const idElements = <HiddenIdElements />
  return (
    <Form method={"POST"} ref={formRef}>
      <Stack direction="row" spacing={1}>
        <TextField name="key" defaultValue="" autoFocus inputRef={inputRef} sx={{ width: 120 }} size="small" />
        <TextField name="value" defaultValue="" sx={{ flex: 1 }} size="small" />
        {idElements}
        <Button type="submit" variant="contained" tabIndex={-1}>{t("Save")}</Button>
      </Stack>
    </Form>
  )
}

function HiddenIdElements({ value }: { value?: LookupValue }) {
  const { lookup, regulationId } = useLoaderData() as LoaderData;
  return (
    <>
      <input type="hidden" name="regulationId" value={regulationId} />
      <input type="hidden" name="lookupId" value={lookup.id} />
      {value && <input type="hidden" name="lookupValueId" value={value.id} />}
    </>
  )

}
