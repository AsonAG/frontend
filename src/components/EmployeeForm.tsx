import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link as RouterLink, useRouteLoaderData } from "react-router-dom";

export function EmployeeForm() {
  const loaderData = useRouteLoaderData("employee") as any;
  const employee= loaderData?.employee;
  const isNew = !employee;
  const divisions = JSON.stringify(employee?.divisions);
  const title = isNew ? "New employee" : null;
  const backPath = isNew ? ".." : "../..";
  const { t } = useTranslation();
  console.log("employee", employee);
  return (
    <Form method="post">
      <ContentLayout title={title}>
        <TextField label={t("First name")} required name="firstName" defaultValue={employee?.firstName}/>
        <TextField label={t("Last name")} required name="lastName" defaultValue={employee?.lastName}/>
        {!isNew && <input type="hidden" name="identifier" value={employee?.identifier} /> }
        <TextField label={t("Identifier")} required name="identifier" defaultValue={employee?.identifier} disabled={!isNew}/>
        <input type="hidden" name="divisions" value={divisions} />
        <Stack direction="row" justifyContent="right" spacing={1}>
          <Button component={RouterLink} to={backPath} relative="path">{t("Back")}</Button>
          <Button type="submit" variant="contained">{t("Save")}</Button>
        </Stack>
      </ContentLayout>
    </Form>
  )
}