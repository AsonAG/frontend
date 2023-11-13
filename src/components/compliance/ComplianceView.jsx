import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { IconButton, Stack } from "@mui/material";
import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import { ComplianceDocumentsView } from "./ComplianceDocumentsView";


export function AsyncComplianceView() {
  const { t } = useTranslation();
  var button = <IconButton LinkComponent={Link} to="settings"><Settings /></IconButton>;
  return (
    <ContentLayout title={t("Compliance")} height="100%" buttons={button}>
      <AsyncDataRoute skipDataCheck>
        <ComplianceView />
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function ComplianceView() {
  return (
    <Stack spacing={2}>
      <ComplianceDocumentsView />
    </Stack>
  )
}
