import React from "react";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, useRouteLoaderData } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { Employee } from "../models/Employee";

import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "../components/ResponsiveDialog";
import { DashboardHeader } from "./DashboardHeader";
import { PeriodDocuments } from "./PeriodDocuments";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";

export function ReviewOpenPeriod() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  return (
    <>
      <ContentLayout title={<DashboardHeader />}>
        <PeriodDocuments />
        <Stack direction="row" justifyContent="end">
          <ResponsiveDialog>
            <ResponsiveDialogTrigger>
              <Button variant="contained" color="primary">{t("Close period")}</Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <Typography variant="h6">{t("Close period")}</Typography>
              <Typography>{t("Upon closing the period, these documents will be sent to swissdec.")}</Typography>
              <Typography>{t("A closed period cannot be reopened.")}</Typography>
              <Stack direction="row" justifyContent="end" spacing={2}>
                <ResponsiveDialogClose>
                  <Button>{t("Cancel")}</Button>
                </ResponsiveDialogClose>
                <Form method="post">
                  <input type="hidden" name="payrunPeriodId" value={payrunPeriod.id} />
                  <Button variant="contained" type="submit" color="primary">{t("Close period")}</Button>
                </Form>
              </Stack>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </Stack>
      </ContentLayout>
    </>
  )
}

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
}
