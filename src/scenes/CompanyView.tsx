
import {
  Navigate,
  useOutlet
} from "react-router-dom";
import { ContentLayout } from "../components/ContentLayout";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TabLink } from "../components/TabLink";
import React from "react";

export function CompanyView() {
  const outlet = useOutlet();
  const { t } = useTranslation();

  if (!outlet) {
    return <Navigate to="new" replace />;
  }
  return (
    <ContentLayout title={t("Company")}>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TabLink title={t("New event")} to="new" />
        <TabLink title={t("Events")} to="events" />
        <TabLink title={t("Documents")} to="documents" />
        <TabLink
          title={t("Missing data")}
          to="missingdata"
        />
      </Stack>
      {outlet}
    </ContentLayout>
  );
}
