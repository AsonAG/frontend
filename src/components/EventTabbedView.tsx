import React, { ReactNode } from "react";
import {
  Navigate,
  useOutlet,
  useLoaderData,
  NavLink as RouterLink,
  Outlet,
  useParams,
} from "react-router-dom";
import { ContentLayout, PageHeaderTitle } from "../components/ContentLayout";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMissingDataCount } from "../utils/dataAtoms";
import { TabLink } from "../components/TabLink";
import { IdType } from "../models/IdType";
import { useIsMobile } from "../hooks/useIsMobile";

type LoaderData = {
  pageTitle: string,
  missingDataId: IdType;
}

export function EventTabbedView({ title, showMissingData }: { title: ReactNode, showMissingData?: boolean }) {
  const outlet = useOutlet();
  const isMobile = useIsMobile();
  const { pageTitle, missingDataId } = useLoaderData() as LoaderData;
  const { t } = useTranslation();
  const params = useParams();
  const renderTitleOnly = !!params.caseName;

  const missingDataCount = useMissingDataCount(missingDataId);

  if (!outlet) {
    let to = "events";
    if (showMissingData && (missingDataCount ?? 0) > 0) {
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
          <TabLink title={t("Documents")} to="documents" />
          {showMissingData && missingDataCount && (
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
