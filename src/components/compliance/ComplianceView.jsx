import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { IconButton, Stack, Typography } from "@mui/material";
import { Link, useLoaderData } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import { ComplianceItemView } from "./ComplianceDocumentsView";


export function ComplianceView() {
  const { t } = useTranslation();
  const routeData = useLoaderData();
  var button = <IconButton LinkComponent={Link} to="settings"><Settings /></IconButton>;
  return (
    <ContentLayout title={t("Compliance")} height="100%" buttons={button}>
      <Stack spacing={3}>
        <Typography variant="h6">{t("Documents")}</Typography>
        <ComplianceItemView dataPromise={routeData.documents} path="documents"/>
        <Typography variant="h6">{t("Submissions")}</Typography>
        <ComplianceItemView dataPromise={routeData.submissions} path="submissions"/>
      </Stack>
    </ContentLayout>
  );
}
