import React from "react";

import {
  Navigate,
  useLoaderData,
  useOutlet,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EventTabbedView } from "../components/EventTabbedView";
import { TabLink } from "../components/TabLink";

type LoaderData = {
  onboardingTaskCount: number
}

export function CompanyTabbedView() {
  const { t } = useTranslation();
  const outlet = useOutlet();
  const { onboardingTaskCount } = useLoaderData() as LoaderData;
  const onboardingTab = onboardingTaskCount > 0 && <TabLink title={t("Onboarding")} to="onboarding" badgeCount={onboardingTaskCount} />
  if (!outlet && onboardingTaskCount > 0) {
    return <Navigate to="onboarding" replace />;
  }
  return (
    <EventTabbedView startTabs={onboardingTab} />
  );
}
