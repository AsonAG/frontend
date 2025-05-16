import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Await, Link, Outlet, useAsyncError, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { Alert, Chip, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { ArrowDropDown, ArrowDropUp, Code, Functions, PictureAsPdf } from "@mui/icons-material";
import { getEmployeeDisplayString } from "../models/Employee";
import { PayrunDocument, PayrunPeriod } from "../models/PayrunPeriod";
import { IdType } from "../models/IdType";

type LoaderData = {
  documents: Promise<Document[]>
}
type PayrunPeriodLoaderData = {
  payrunPeriod: PayrunPeriod
}

export function PeriodDocuments() {
  return (
    <>
      <PayrunPeriodDocuments />
      <WageStatementSection />
      <Outlet />
    </>
  )
}

function PayrunPeriodDocuments() {
  const { documents } = useLoaderData() as LoaderData;
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
  return (
    <Suspense fallback={<LoadingView />}>
      <Await resolve={documents} errorElement={<ErrorView />}>
        {(docs) => docs.map(doc => <DocumentSection key={doc.id} payrunPeriodId={payrunPeriod.id} document={doc} />)}
      </Await>
    </Suspense>
  );
}


function LoadingView() {
  const { t } = useTranslation();
  const [showText, setShowText] = useState(false);
  useEffect(() => {
    setTimeout(() => setShowText(true), 1500)
  }, []);
  const text = showText ? t("The documents are being generated, this can take up to a few minutes...") : '\u00A0'; // nbsp
  return (
    <Stack spacing={2}>
      <CircularProgress />
      <Typography>{text}</Typography>
    </Stack>
  )
}

const errorStates = {
  400: { severity: "warning", text: "The payrun period is not processed yet. The documents cannot be generated. Please try again after." },
  409: { severity: "warning", text: "The generation of the documents was interrupted. This is due to a new change. Please reload the page to view the up to date documents." }
}

function ErrorView() {
  const error = useAsyncError() as Response;
  const { t } = useTranslation();


  const state = errorStates[error.status] ?? { severity: "error", text: "There was an error generating the documents." };
  return <Alert severity={state.severity} variant="filled"><Typography>{t(state.text)}</Typography></Alert>
}

function WageStatementSection() {
  const { t } = useTranslation();
  const { payrunPeriod } = useRouteLoaderData("payrunperiod") as PayrunPeriodLoaderData;
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
type DocumentSectionProps = {
  payrunPeriodId: IdType,
  document: PayrunDocument
}
function DocumentSection({ payrunPeriodId, document }: DocumentSectionProps) {
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
