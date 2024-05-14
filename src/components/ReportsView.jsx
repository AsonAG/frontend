import { React } from "react";
import { useAsyncValue, Link } from "react-router-dom";
import {
	Stack,
	Card,
	CardActionArea,
	CardContent,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Centered } from "./Centered";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { ContentLayout } from "./ContentLayout";

export function AsyncReportsView() {
	const { t } = useTranslation();
	return (
		<ContentLayout title={t("Reports")}>
			<AsyncDataRoute>
				<ReportsView />
			</AsyncDataRoute>
		</ContentLayout>
	);
}

const styling = {
	flex: "1 1 300px",
	borderRadius: (theme) => theme.spacing(1),
	color: (theme) => theme.palette.text.primary,
	"&:hover": {
		color: (theme) => theme.palette.primary.main,
		backgroundColor: (theme) => theme.palette.primary.hover,
	},
};

function ReportCard({ report }) {
	return (
		<Card sx={styling}>
			<CardActionArea
				component={Link}
				to={`${report.id}`}
				sx={{ height: "100%" }}
				state={{ reportName: report.displayName }}
			>
				<CardContent>
					<Typography
						gutterBottom
						variant="h3"
						fontWeight="bold"
						component="div"
					>
						{report.displayName}
					</Typography>
					{report.description && (
						<Typography variant="body2" color="text.secondary">
							{report.displayDescription}
						</Typography>
					)}
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

function ReportsView() {
	const reports = useAsyncValue();
	const { t } = useTranslation();

	if (!reports.length) {
		return (
			<Centered>
				<Typography>{t("No reports")}</Typography>
			</Centered>
		);
	}

	return (
		<Stack spacing={3} direction="row" flexWrap="wrap">
			{reports.map((report) => (
				<ReportCard key={report.id} report={report} />
			))}
		</Stack>
	);
}
