import React, { useState } from "react";
import { ContentLayout } from "../components/ContentLayout";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigation, useRouteLoaderData, useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "../hooks/useRole";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../components/ResponsiveDialog";
import { Organization } from "../models/Organization";

type LoaderData = {
  org: Organization
}

export function OrganizationSettings() {
  const { org } = useRouteLoaderData("orgRoot") as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title="Settings">
      <TextField value={org.identifier} disabled label={t("Company name")} />
      <ProviderOrganizationSection org={org} />
    </ContentLayout>
  );
}

function ProviderOrganizationSection({ org }) {
  const { t } = useTranslation();
  const isProvider = useRole("provider");
  const [onExport, exportButtonDisabled, exportButtonIcon] = useAction("export");
  const [onDelete, deleteButtonDisabled, deleteButtonIcon] = useAction("delete");
  if (!isProvider) return null;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center">
        <Typography flex={1}>{t("Export the data of the organization")}</Typography>
        <Button variant="outlined" color="primary" disabled={exportButtonDisabled} startIcon={exportButtonIcon} onClick={onExport}>
          {t("Export")}
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography flex={1}>{t("Deletes the organization completely")}</Typography>
        <ResponsiveDialog>
          <ResponsiveDialogTrigger>
            <Button variant="contained" color="destructive" disabled={deleteButtonDisabled} startIcon={deleteButtonIcon}>
              {t("Delete")}
            </Button>
          </ResponsiveDialogTrigger>
          <DeleteOrganizationDialogContent org={org} onDelete={onDelete} />
        </ResponsiveDialog>
      </Stack>

    </Stack>
  )
}

function DeleteOrganizationDialogContent({ org, onDelete }) {
  const { t } = useTranslation();
  const [confirmOrgName, setConfirmOrgName] = useState('');
  const deleteButtonEnabled = confirmOrgName === org.identifier;
  return (
    <ResponsiveDialogContent>
      <Typography variant="h6">{t("Delete organization")}</Typography>
      <Typography>{t("delete_organization_description", { orgName: org.identifier })}</Typography>
      <Typography>{t("confirm_organization_deletion")}</Typography>
      <TextField variant="standard" value={confirmOrgName} placeholder={t("Organization name")} onChange={e => setConfirmOrgName(e.target.value)} />
      <Stack direction="row" justifyContent="end" spacing={1}>
        <ResponsiveDialogClose>
          <Button>{t("Cancel")}</Button>
        </ResponsiveDialogClose>
        <ResponsiveDialogClose>
          <Button variant="contained" color="destructive" disabled={!deleteButtonEnabled} onClick={onDelete}>{t("Delete")}</Button>
        </ResponsiveDialogClose>
      </Stack>
    </ResponsiveDialogContent>
  )
}


function useAction(actionName: string): [() => void, boolean, JSX.Element | undefined] {
  const submit = useSubmit();
  const navigation = useNavigation();

  const onAction = () => {
    const formData = new FormData();
    formData.append("intent", actionName);
    submit(formData, { method: "POST" });
  };

  const actionDisabled = navigation.state === "submitting";
  let icon: JSX.Element | undefined;

  if (navigation.state === "submitting" && navigation.formData?.get("intent") === actionName) {
    icon = <CircularProgress
      size="1rem"
      sx={{ color: (theme) => theme.palette.text.disabled }}
    />;
  }

  return [onAction, actionDisabled, icon];

}
