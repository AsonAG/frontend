import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { IconButton, Stack, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import { ComplianceDocumentsView } from "./ComplianceDocumentsView";


export function ComplianceView() {
  const { t } = useTranslation();
  var button = <IconButton LinkComponent={Link} to="settings"><Settings /></IconButton>;
  return (
    <ContentLayout title={t("Compliance")} height="100%" buttons={button}>
      <Stack spacing={3}>
        <Typography variant="h6">{t("Documents")}</Typography>
        <ComplianceDocumentsView />
        <Typography variant="h6">{t("Submissions")}</Typography>
      </Stack>
    </ContentLayout>
  );
}
