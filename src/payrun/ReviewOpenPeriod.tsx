import React, { useMemo, useState } from "react";
import { ContentLayout, PageHeaderTitle } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link, Navigate, Outlet, useRouteLoaderData } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, ChevronLeft, Code, PictureAsPdf } from "@mui/icons-material";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { Employee, getEmployeeDisplayString } from "../models/Employee";

import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "../components/ResponsiveDialog";

export function ReviewOpenPeriod() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  if (payrunPeriod.periodStatus !== "Open") {
    return <Navigate to=".." relative="path" />
  }
  return (
    <>
      <ContentLayout title={<PeriodSection />}>
        {payrunPeriod.documents?.map(doc => (
          <DocumentSection key={doc.id} payrunPeriodId={payrunPeriod.id} document={doc} />
        ))}
        {/*<WageStatementSection />*/}
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
      <Outlet />
    </>
  )
}

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
}

function PeriodSection() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  const periodDate = dayjs.utc(payrunPeriod.periodStart).format("MMMM YYYY");
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton component={Link} to=".." relative="path"><ChevronLeft /></IconButton>
        <PageHeaderTitle title={periodDate} />
      </Stack>
      <Chip color="success" size="small" label={t("Offen")} />
    </Stack>
  );
}


function WageStatementSection() {
  const { t } = useTranslation();
  const { payrunPeriod, employees } = useRouteLoaderData("payrunperiod") as LoaderData;
  const [open, setOpen] = useState(false);
  const entriesMap = useMemo(() => new Map(payrunPeriod.entries.map(e => [e.employeeId, e])), [payrunPeriod.entries]);
  const wageStatements = employees.map(employee => {
    const entry = entriesMap.get(employee.id);
    const wageStatementDoc = entry?.documents?.find(doc => doc.attributes?.review)
    return wageStatementDoc ? [getEmployeeDisplayString(employee), entry?.id, wageStatementDoc] : null;
  }).filter(Boolean);
  if (wageStatements.length === 0)
    return;

  return (
    <Stack>
      <Stack direction="row" spacing={2}>
        <Typography variant="h6" flex={1}>{t("Wage statements")}</Typography>
        <IconButton onClick={() => setOpen(o => !o)}>{open ? <ArrowDropUp /> : <ArrowDropDown />}</IconButton>
      </Stack>
      {open && <WageStatements wageStatements={wageStatements} />}
    </Stack>
  );
}
function WageStatements({ wageStatements }) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={1}>
      {
        wageStatements.map(([label, entryId, doc]) => (
          <Chip
            key={doc.id}
            component={Link}
            to={`${entryId}/doc/${doc.id}?report=${encodeURIComponent(doc.attributes?.report[0].Name)}`}
            label={label}
            size="small"
            icon={<PictureAsPdf fontSize="small" />}
            onClick={noop}
            color="pdfred" />
        ))
      }
    </Stack>
  );
}

const noop = () => { };
function DocumentSection({ payrunPeriodId, document }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6">{document.name}</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip
          component={Link}
          to={`${payrunPeriodId}/doc/${document.id}`}
          label="XML"
          size="small"
          icon={<Code fontSize="small" />}
          onClick={noop}
          color="blueviolet" />
        {document.attributes?.reports?.flatMap(report => {
          if (report.Variants) {
            return report.Variants.map(variant => (
              <Chip
                key={variant}
                component={Link}
                to={`${payrunPeriodId}/doc/${document.id}?report=${encodeURIComponent(report.Name)}&variant=${encodeURIComponent(variant)}`}
                label={report.Name.split(".").pop() + " " + variant}
                size="small"
                icon={<PictureAsPdf fontSize="small" />}
                onClick={noop}
                color="pdfred" />
            ));
          }
          return (
            <Chip
              key={report.Name}
              component={Link}
              to={`${payrunPeriodId}/doc/${document.id}?report=${encodeURIComponent(report.Name)}`}
              label={report.Name.split(".").pop()}
              size="small"
              icon={<PictureAsPdf fontSize="small" />}
              onClick={noop}
              color="pdfred" />
          )
        }
        )}
      </Stack>
    </Stack >
  )
}
