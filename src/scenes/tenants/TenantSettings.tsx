import React, { useState } from "react";
import { ContentLayout } from "../../components/ContentLayout";
import { Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useNavigation, useRouteLoaderData, useSubmit } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "../../hooks/useRole";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../../components/ResponsiveDialog";
import { Tenant } from "../../models/Tenant";

type LoaderData = {
  tenant: Tenant
}

export function TenantSettings() {
  const { tenant } = useRouteLoaderData("tenantRoot") as LoaderData;
  const { t } = useTranslation();
  return (
    <ContentLayout title="Settings">
      <TextField value={tenant.identifier} disabled label={t("Company name")} />
      <ProviderTenantSection tenant={tenant} />
    </ContentLayout>
  );
}

function ProviderTenantSection({ tenant }) {
  const { t } = useTranslation();
  const isProvider = useRole("provider");
  const [onExport, exportButtonDisabled, exportButtonIcon] = useAction("export");
  const [onDelete, deleteButtonDisabled, deleteButtonIcon] = useAction("delete");
  if (!isProvider) return null;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center">
        <Typography flex={1}>{t("Export the data of the tenant")}</Typography>
        <Button variant="outlined" color="primary" disabled={exportButtonDisabled} startIcon={exportButtonIcon} onClick={onExport}>
          {t("Export")}
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Typography flex={1}>{t("Deletes the tenant completely")}</Typography>
        <ResponsiveDialog>
          <ResponsiveDialogTrigger>
            <Button variant="contained" color="destructive" disabled={deleteButtonDisabled} startIcon={deleteButtonIcon}>
              {t("Delete")}
            </Button>
          </ResponsiveDialogTrigger>
          <DeleteTenantDialogContent tenant={tenant} onDelete={onDelete} />
        </ResponsiveDialog>
      </Stack>

    </Stack>
  )
}

function DeleteTenantDialogContent({ tenant, onDelete }) {
  const { t } = useTranslation();
  const [confirmTenantName, setConfirmTenantName] = useState('');
  const deleteButtonEnabled = confirmTenantName === tenant.identifier;
  return (
    <ResponsiveDialogContent>
      <Typography variant="h6">{t("Delete tenant")}</Typography>
      <Typography>{t("delete_tenant_description", { tenantName: tenant.identifier })}</Typography>
      <Typography>{t("confirm_tenant_deletion")}</Typography>
      <TextField variant="standard" value={confirmTenantName} placeholder={t("Tenant name")} onChange={e => setConfirmTenantName(e.target.value)} />
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
