import { ContentLayout, PageContent } from "../ContentLayout";
import { useTranslation } from "react-i18next";
import {
	useLocation,
	Await,
	useLoaderData,
	useAsyncValue,
	Link,
} from "react-router-dom";
import {
	Skeleton,
	Typography,
	Stack,
	IconButton,
	Tooltip,
	Paper,
	Divider,
	Alert,
	AlertTitle,
} from "@mui/material";
import { Suspense, useState } from "react";
import { ComplianceMessage } from "./ComplianceMessage";
import { Science } from "@mui/icons-material";

export function AsyncComplianceSubmissionView() {
	const [expertMode, setExpertMode] = useState(false);
	const loaderData = useLoaderData();
	const { t } = useTranslation();
	const toggleExpertModeButton = (
		<ToggleExpertModeButton
			expertMode={expertMode}
			setExpertMode={setExpertMode}
		/>
	);
	const details = (
		<ComplianceSubmissionDetails
			expertMode={expertMode}
			buttons={toggleExpertModeButton}
		/>
	);
	return (
		<Stack spacing={3}>
			<Suspense fallback={details}>
				<Await resolve={loaderData.submission}>{details}</Await>
			</Suspense>

			<PageContent>
				<Typography variant="h6">{t("Offene Aufgaben")}</Typography>
				<Stack
					component={Paper}
					variant="outlined"
					divider={<Divider flexItem />}
				>
					<ComplianceTaskRow title="DialogResult Aufgabe" />
					<ComplianceTaskRow title="CompletionAndResult Aufgabe" />
					<ComplianceTaskRow title="Result (? wahrscheinlich nicht)" />
					<ComplianceTaskRow title="CompletionAndResult Aufgabe" />
				</Stack>
			</PageContent>

			<PageContent>
				<Typography variant="h6">{t("Erledigte Aufgaben")}</Typography>
				<Stack
					component={Paper}
					variant="outlined"
					divider={<Divider flexItem />}
				>
					<ComplianceTaskRow title="CompletionAndResult" completed />
					<ComplianceTaskRow title="DialogResult" completed />
				</Stack>
			</PageContent>

			{expertMode && (
				<PageContent>
					<ComplianceMessagesView messagesPromise={loaderData.messages} />
				</PageContent>
			)}
		</Stack>
	);
}

function ComplianceSubmissionDetails({ expertMode, buttons }) {
	const { t } = useTranslation();
	const { state } = useLocation();
	const submission = useAsyncValue() ?? state?.submission;
	return (
		<ContentLayout
			title={submission ? submission.name : <Skeleton />}
			buttons={buttons}
		>
			<Typography variant="h6">{t("Status")}</Typography>
			<Typography>
				{submission ? t(submission.submissionStatus) : <Skeleton />}
			</Typography>
			{submission?.errors && (
				<Alert severity="error" variant="filled">
					<AlertTitle>{submission.errors}</AlertTitle>
					{t("Contact your IT administrator to resolve this problem.")}
				</Alert>
			)}
			<Typography variant="h6">{t("DeclarationId")}</Typography>
			<Typography>
				{submission ? (
					submission.declarationId ?? "No declaration id"
				) : (
					<Skeleton />
				)}
			</Typography>
		</ContentLayout>
	);
}

function ComplianceMessages() {
	const messages = useAsyncValue();
	return messages.map((msg) => (
		<ComplianceMessage key={msg.id} message={msg} />
	));
}

export function ComplianceMessagesView({ messagesPromise }) {
	const { t } = useTranslation();
	return (
		<>
			<Typography variant="h6">{t("Messages")}</Typography>
			<Suspense fallback={<LoadingComplianceMessages />}>
				<Await resolve={messagesPromise}>
					<ComplianceMessages />
				</Await>
			</Suspense>
		</>
	);
}

function LoadingComplianceMessages() {
	return (
		<>
			<Skeleton variant="rectangular" height="110px" />
			<Skeleton variant="rectangular" height="110px" />
			<Skeleton variant="rectangular" height="110px" />
		</>
	);
}

function ToggleExpertModeButton({ expertMode, setExpertMode }) {
	const { t } = useTranslation();
	return (
		<Tooltip title={t("Expert mode")}>
			<IconButton
				color={expertMode ? "primary" : "default"}
				onClick={() => setExpertMode((m) => !m)}
			>
				<Science />
			</IconButton>
		</Tooltip>
	);
}

function ComplianceTaskRow({ title, completed }) {
	const bgcolor = completed ? "rgba(0, 0, 0, 0.02)" : undefined;
	return (
		<Typography
			component={Link}
			to="tasks/1"
			relative="path"
			p={1}
			bgcolor={bgcolor}
		>
			{title}
		</Typography>
	);
}
