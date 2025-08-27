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
	pageTitle: string;
	missingData: MissingData;
};

type EventTabbedViewProps = {
	title?: ReactNode;
	startTabs?: ReactNode;
	endTabs?: ReactNode;
};

export function EventTabbedView({
	title,
	startTabs,
	endTabs,
}: EventTabbedViewProps) {
	const outlet = useOutlet();
	const isMobile = useIsMobile();
	const { pageTitle, missingData } = useLoaderData() as LoaderData;
	const { t } = useTranslation();
	const params = useParams();
	const renderTitleOnly = !!params.caseName;

	const missingDataCount = missingData?.cases?.length ?? 0;

	if (!outlet) {
		let to = isMobile ? "new" : "data";
		return <Navigate to={to} replace />;
	}
	return (
		<ContentLayout title={renderTitleOnly ? pageTitle : (title ?? pageTitle)}>
			{!renderTitleOnly && (
				<Stack direction="row" spacing={2} flexWrap="wrap">
					{startTabs}
					{isMobile && <TabLink title={t("New event")} to="new" />}
					<TabLink title={t("Data")} to="data" badgeCount={missingDataCount} />
					<TabLink title={t("Documents")} to="documents" />
					<TabLink title={t("Events")} to="events" />
					{endTabs}
				</Stack>
			)}
			{outlet}
		</ContentLayout>
	);
}
