import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useRouteLoaderData } from "react-router-dom";
import { Chip, IconButton, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, Code, PictureAsPdf } from "@mui/icons-material";
import { Employee, getEmployeeDisplayString } from "../models/Employee";
import { PayrunPeriod } from "../models/PayrunPeriod";

type LoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
}

export function PeriodDocuments() {
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  return (
    <>
      {payrunPeriod.documents?.map(doc => (
        <DocumentSection key={doc.id} payrunPeriodId={payrunPeriod.id} document={doc} />
      ))}
      <WageStatementSection />
      <Outlet />
    </>
  )
}
function WageStatementSection() {
  const { t } = useTranslation();
  const { payrunPeriod, employees } = useRouteLoaderData("payrunperiod") as LoaderData;
  const [open, setOpen] = useState(false);
  const entriesMap = useMemo(() => new Map(payrunPeriod.entries.map(e => [e.employeeId, e])), [payrunPeriod.entries]);
  const wageStatements = employees.map(employee => {
    const entry = entriesMap.get(employee.id);
    const wageStatementDoc = entry?.documents?.find(doc => doc.attributes?.type === "wagestatement")
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
            variant="outlined"
            component={Link}
            to={`${entryId}/doc/${doc.id}?report=${encodeURIComponent(doc.attributes?.reports[0].Name)}`}
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
          variant="outlined"
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
                variant="outlined"
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
              variant="outlined"
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
