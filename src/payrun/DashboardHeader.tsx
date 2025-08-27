import { Link, useRouteLoaderData } from "react-router-dom";
import { Employee } from "../models/Employee";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { AvailableCase } from "../models/AvailableCase";
import dayjs from "dayjs";
import React, { PropsWithChildren } from "react";
import { Box, Chip, Divider, IconButton, Stack, Tooltip } from "@mui/material";
import { PageHeaderTitle } from "../components/ContentLayout";
import {
	ChevronLeft,
	NextPlan,
	PriceCheck,
	Receipt,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { FilterButton } from "./EntryFilter";
import { CalculatingIndicator } from "./CalculatingIndicator";

type LoaderData = {
	employees: Array<Employee>;
	payrunPeriod: PayrunPeriod;
	previousPayrunPeriod: PayrunPeriod | undefined;
	controllingTasks: Array<Array<AvailableCase>>;
};

type DashboardHeaderProps = {
	index?: boolean;
} & PropsWithChildren;

export function DashboardHeader({ index, children }: DashboardHeaderProps) {
	const { payrunPeriod } = useRouteLoaderData("payrunperiod") as LoaderData;
	const { t } = useTranslation();
	const periodDate = dayjs.utc(payrunPeriod.periodStart).format("MMMM YYYY");
	const periodOpen = payrunPeriod.periodStatus === "Open";
	return (
		<Stack
			direction="row"
			spacing={1}
			alignItems="center"
			width="100%"
			pr={0.5}
		>
			<Stack direction="row" spacing={0.5} alignItems="center">
				<IconButton component={Link} to={".."} relative="path">
					<ChevronLeft />
				</IconButton>
				<PageHeaderTitle title={periodDate} />
			</Stack>
			{periodOpen && <Chip color="success" size="small" label={t("Offen")} />}
			{!!index && (
				<>
					<Box sx={{ flex: 1 }}>{children}</Box>
					<Tooltip title={t("Filter")}>
						<FilterButton />
					</Tooltip>
					<Divider
						orientation="vertical"
						variant="middle"
						flexItem
						sx={{ mx: 0.75 }}
					/>
					<Tooltip title={t("Payouts")}>
						<IconButton component={Link} to="payouts">
							<PriceCheck />
						</IconButton>
					</Tooltip>
					{periodOpen ? (
						<ReviewButton payrunPeriod={payrunPeriod} />
					) : (
						<Tooltip title={t("Documents")}>
							<IconButton component={Link} to="documents">
								<Receipt />
							</IconButton>
						</Tooltip>
					)}
				</>
			)}
		</Stack>
	);
}

function ReviewButton({ payrunPeriod }: { payrunPeriod: PayrunPeriod }) {
	const { t } = useTranslation();
	const isProcessing = payrunPeriod.processingStatus === "Processing";
	const tooltip = isProcessing
		? "The period is being processed..."
		: "Go to period completion...";
	return (
		<Tooltip title={t(tooltip)}>
			<span>
				<IconButton
					component={Link}
					to="review"
					color="primary"
					disabled={isProcessing}
				>
					<NextPlan />
				</IconButton>
			</span>
		</Tooltip>
	);
}
