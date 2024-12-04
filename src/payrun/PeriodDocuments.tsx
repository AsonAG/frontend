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
    <Stack spacing={1}>
      {
        wageStatements.map(([label, entryId, doc]) => (
          <Stack direction="row" spacing={1}>
            <Typography>{label}</Typography>
            <XmlChip to={`${entryId}/doc/${doc.id}`} />
            <PdfChip to={`${entryId}/doc/${doc.id}?report=${encodeURIComponent(doc.attributes?.reports[0].Name)}`} />
          </Stack>
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
        <XmlChip to={`${payrunPeriodId}/doc/${document.id}`} />
        {document.attributes?.reports?.flatMap(report => {
          if (report.Variants) {
            return report.Variants.map(variant => (
              <PdfChip
                key={variant}
                label={report.Name.split(".").pop() + " " + variant}
                to={`${payrunPeriodId}/doc/${document.id}?report=${encodeURIComponent(report.Name)}&variant=${encodeURIComponent(variant)}`}
              />
            ));
          }
          return (
              <PdfChip
              key={report.Name}
              label={report.Name.split(".").pop()}
              to={`${payrunPeriodId}/doc/${document.id}?report=${encodeURIComponent(report.Name)}`}
              />
          )
        }
        )}
      </Stack>
    </Stack >
  )
}


function XmlChip({ to }: { to: string }) {
  return (
    <Chip
      component={Link}
      variant="outlined"
      to={to}
      label="XML"
      size="small"
      icon={<Code fontSize="small" />}
      onClick={noop}
      color="blueviolet" />
  )
}

function PdfChip({ to, label }: { to: string, label?: string }) {
  label ??= "PDF";
  return (
    <Chip
      variant="outlined"
      component={Link}
      to={to}
      label={label}
      size="small"
      icon={<PictureAsPdf fontSize="small" />}
      onClick={noop}
      color="pdfred" />
  )
}
