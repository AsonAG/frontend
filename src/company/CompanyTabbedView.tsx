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
  missingWageTypeAccountInfoCount: number
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
    <EventTabbedView startTabs={onboardingTab} endTabs={<ConfigTabs />} />
  );
}

function ConfigTabs() {
  const { t } = useTranslation();
  const { missingWageTypeAccountInfoCount } = useLoaderData() as LoaderData;
  return (
    <>
      <TabLink title={t("Wage type master")} to="wagetypemaster" badgeCount={missingWageTypeAccountInfoCount} />
      <TabLink title={t("Account master")} to="accountmaster" />
      <TabLink title={t("Cost center master")} to="costcentermaster" />
    </>
  )
}
