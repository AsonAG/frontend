import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { Button, Stack, Typography } from "@mui/material";
import { useAsyncValue, useLocation } from 'react-router-dom';
import { XmlView } from "./XmlView";
import { useMemo } from "react";
import { base64Decode } from "../../services/converters/BinaryConverter";


export function AsyncComplianceDocumentView() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const title = state?.document ? state.document.name : t("Loading...");
  const loading = <ContentLayout title={title} />
  return (
    <AsyncDataRoute loadingElement={loading} skipDataCheck>
      <ComplianceDocumentView />
    </AsyncDataRoute>
  );
}

function ComplianceDocumentView() {
  const { t } = useTranslation();
  const doc = useAsyncValue();

  const docXml = useMemo(() => base64Decode(doc.content), [doc.content]);
  console.log(doc, docXml);
  
  return (
    <ContentLayout title={doc.name}>
      <Stack spacing={2}>
        <XmlView title={t("Content")} xml={docXml} />
        <Stack direction="row" spacing={2} alignSelf="end">
          <Button color="primary">{t("Submit as test")}</Button>
          <Button color="primary" variant="contained">{t("Submit")}</Button>
        </Stack>
      </Stack>
    </ContentLayout>
  )
}