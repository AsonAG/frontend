import React, { ReactNode } from "react";
import {
  Navigate,
  useOutlet,
  useLoaderData,
  useParams,
} from "react-router-dom";
import { ContentLayout } from "../components/ContentLayout";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TabLink } from "../components/TabLink";
import { useIsMobile } from "../hooks/useIsMobile";
import { MissingData } from "../models/MissingData";

type LoaderData = {
  pageTitle: string
  missingData: MissingData
}

export function EventTabbedView({ title, showMissingData }: { title: ReactNode, showMissingData?: boolean }) {
  const outlet = useOutlet();
  const isMobile = useIsMobile();
  const { pageTitle, missingData } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  const params = useParams();
  const renderTitleOnly = !!params.caseName;

  const missingDataCount = missingData?.cases?.length ?? 0;

  if (!outlet) {
    let to = "events";
    if (showMissingData && missingDataCount > 0) {
      to = "missingdata"
    }
    else if (isMobile) {
      to = "new"
    }
    return <Navigate to={to} replace />;
  }
  return (
    <ContentLayout title={renderTitleOnly ? pageTitle : title ?? pageTitle}>
      {
        !renderTitleOnly &&
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {isMobile && <TabLink title={t("New Event")} to="new" />}
          <TabLink title={t("Events")} to="events" />
          <TabLink title={t("Data")} to="data" />
          <TabLink title={t("Documents")} to="documents" />
          {showMissingData && missingDataCount > 0 && (
            <TabLink
              title={t("Missing data")}
              to="missingdata"
              badgeCount={missingDataCount}
            />
          )}
        </Stack>
      }
      {outlet}
    </ContentLayout>
  );
}
