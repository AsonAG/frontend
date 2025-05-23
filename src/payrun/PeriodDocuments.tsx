import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useRouteLoaderData } from "react-router-dom";
import { Chip, IconButton, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, Code, Functions, PictureAsPdf } from "@mui/icons-material";
import { getEmployeeDisplayString } from "../models/Employee";
import { PayrunDocument, PayrunPeriod } from "../models/PayrunPeriod";

type LoaderData = {
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
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
  const [open, setOpen] = useState(false);
  const wageStatements = payrunPeriod.entries.map(entry => {
    const wageStatementDoc = entry?.documents?.find(doc => doc.attributes?.type === "wagestatement")
    return wageStatementDoc ? [getEmployeeDisplayString(entry), entry?.id, wageStatementDoc] : null;
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
        <DocumentChip doc={document} to={`${payrunPeriodId}/doc/${document.id}`} />
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

type ChipProps = {
  to: string,
  label?: string
}



function DocumentChip({ doc, ...chipProps }: { doc: PayrunDocument } & ChipProps) {
  switch (doc.contentType) {
    case "application/xml":
      return <XmlChip {...chipProps} />
    case "application/pdf":
      return <PdfChip {...chipProps} />
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <ExcelChip {...chipProps} />
  }
}

function XmlChip({ to, label }: ChipProps) {
  label ??= "XML";
  return (
    <Chip
      component={Link}
      variant="outlined"
      to={to}
      label={label}
      size="small"
      icon={<Code fontSize="small" />}
      onClick={noop}
      color="blueviolet" />
  )
}

function PdfChip({ to, label }: ChipProps) {
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

function ExcelChip({ to, label }: ChipProps) {
  label ??= "Excel";
  return (
    <Chip
      variant="outlined"
      component={Link}
      to={to}
      label={label}
      size="small"
      icon={<Functions fontSize="small" />}
      onClick={noop}
      color="green" />
  )
}
