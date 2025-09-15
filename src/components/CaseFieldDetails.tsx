import React, { Fragment } from "react";
import {
	Box,
	Button,
	Dialog,
	Divider,
	IconButton,
	Stack,
	Theme,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { formatDate } from "../utils/DateUtils";
import { useTranslation } from "react-i18next";
import { formatCaseValue } from "../utils/Format";
import { Sidebar } from "./Sidebar";
import { HtmlContent } from "./HtmlContent";
import { Loading } from "./Loading";
import { useIncrementallyLoadedData } from "../hooks/useIncrementallyLoadedData";
import { CaseChangeCaseValue } from "../models/CaseChangeCaseValue";

type CaseField = {
	displayName: string;
	name: string;
	timeType: string;
	description?: string | null;
};
type CaseFieldDetailsProps = {
	caseField: CaseField;
	onClose: () => void;
	view?: "description" | "history";
};

export function CaseFieldDetails({
	caseField,
	onClose,
	view,
}: CaseFieldDetailsProps) {
	const { t } = useTranslation();
	const title = `${t("Details")} ${caseField.displayName}`;
	const closeButton = <ButtonClose onClose={onClose} />;
	const showHistory = caseField.timeType !== "Timeless";

	return (
		<DetailsContainer title={title} closeButton={closeButton}>
			{view === "description" && (
				<CaseFieldDescription description={caseField.description ?? null} />
			)}
			{view === "history" && showHistory && (
				<CaseFieldHistory caseFieldName={caseField.name} />
			)}
		</DetailsContainer>
	);
}

function DetailsContainer({
	title,
	closeButton,
	children,
}: {
	title: string;
	closeButton: React.ReactNode;
	children: React.ReactNode;
}) {
	const useSidebar = useMediaQuery<Theme>((theme) =>
		theme.breakpoints.up(1000),
	);
	const useFullScreen = useMediaQuery<Theme>((theme) =>
		theme.breakpoints.down("sm"),
	);
	if (useSidebar) {
		return (
			<Sidebar title={title} closeButton={closeButton}>
				{children}
			</Sidebar>
		);
	}
	return (
		<Dialog fullScreen={useFullScreen} open fullWidth>
			<DialogHeader title={title} closeButton={closeButton} />
			<Divider />
			<Stack spacing={2} p={2}>
				{children}
			</Stack>
		</Dialog>
	);
}

function DialogHeader({
	title,
	closeButton,
}: {
	title: string;
	closeButton: React.ReactNode;
}) {
	const theme = useTheme();
	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={2}
			px={2}
			sx={theme.mixins.toolbar}
		>
			<Typography variant="h6" sx={{ flex: 1 }}>
				{title}
			</Typography>
			{closeButton}
		</Stack>
	);
}

function ButtonClose({ onClose }: { onClose: () => void }) {
	return (
		<IconButton onClick={onClose} size="small">
			<Close />
		</IconButton>
	);
}

function CaseFieldDescription({
	description,
}: {
	description?: string | null;
}) {
	const { t } = useTranslation();
	if (!description) return null;

	return (
		<Stack spacing={1}>
			<Typography variant="h6">{t("Description")}</Typography>
			<HtmlContent content={description} />
		</Stack>
	);
}

function CaseFieldHistory({ caseFieldName }: { caseFieldName: string }) {
	const { t } = useTranslation();
	return (
		<Stack spacing={1}>
			<Typography variant="h6">{t("History")}</Typography>
			<CaseFieldHistoryTable
				key={caseFieldName}
				caseFieldName={caseFieldName}
			/>
		</Stack>
	);
}

function CaseFieldHistoryTable({ caseFieldName }: { caseFieldName: string }) {
	const { t } = useTranslation();
	const { items, loading, hasMore, loadMore } =
		useIncrementallyLoadedData<CaseChangeCaseValue>(
			`history/${encodeURIComponent(caseFieldName)}`,
			20,
		);
	if (items.length === 0 && loading) {
		return <Loading />;
	}

	if (items.length === 0 && !loading) {
		return <Typography>{t("No data")}</Typography>;
	}

	const buttonEnabled = hasMore && !loading;
	const buttonLabel = loading
		? t("Loading...")
		: hasMore
			? t("Load more")
			: t("Showing all values");

	return (
		<Stack spacing={1}>
			<Box
				display="grid"
				gridTemplateColumns="1fr 75px 75px 75px"
				columnGap="8px"
			>
				<Typography fontWeight="bold">{t("Value")}</Typography>
				<Typography fontWeight="bold">{t("Start")}</Typography>
				<Typography fontWeight="bold">{t("End")}</Typography>
				<Typography fontWeight="bold">{t("Created")}</Typography>
				{items.map((cv) => {
					const caseValueFormatted = formatCaseValue(cv, t);
					return (
						<Fragment key={cv.id}>
							<Typography noWrap title={caseValueFormatted}>
								{caseValueFormatted}
							</Typography>
							<Typography>{formatDate(cv.start)}</Typography>
							<Typography>{formatDate(cv.end)}</Typography>
							<Typography title={formatDate(cv.created, true)}>
								{formatDate(cv.created)}
							</Typography>
						</Fragment>
					);
				})}
			</Box>
			<Button onClick={loadMore} disabled={!buttonEnabled}>
				{buttonLabel}
			</Button>
		</Stack>
	);
}
