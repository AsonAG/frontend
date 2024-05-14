import { useTranslation } from "react-i18next";
import { ContentLayout } from "../ContentLayout";
import { IconButton, Stack, Typography } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import { Add, Settings, Summarize } from "@mui/icons-material";
import {
	ComplianceItemCard,
	ComplianceItemView,
} from "./ComplianceDocumentsView";
import { ComplianceMessagesView } from "./ComplianceSubmissionView";
import { useRole } from "../../hooks/useRole";

export function ComplianceView() {
	const { t } = useTranslation();
	const routeData = useLoaderData();
	const showButton = useRole("onboarding");
	var button = showButton && (
		<IconButton LinkComponent={Link} to="settings">
			<Settings />
		</IconButton>
	);
	return (
		<ContentLayout title={t("Compliance")} height="100%" buttons={button}>
			<Stack spacing={3}>
				<Typography variant="h6">{t("Documents")}</Typography>
				<ComplianceItemView dataPromise={routeData.documents} path="documents">
					<ComplianceItemCard
						to="documents/new"
						title={t("New document")}
						Icon={Add}
					/>
				</ComplianceItemView>
				<Typography variant="h6">{t("Submissions")}</Typography>
				<ComplianceItemView
					dataPromise={routeData.submissions}
					path="submissions"
					Icon={Summarize}
				/>
				<ComplianceMessagesView messagesPromise={routeData.messages} />
			</Stack>
		</ContentLayout>
	);
}
