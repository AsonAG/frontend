import { ContentLayout } from "../components/ContentLayout";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
import {
	Form,
	Link,
	Navigate,
	Outlet,
	useLoaderData,
	useRouteLoaderData,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Payroll } from "../models/Payroll";
import { formatDate } from "../utils/DateUtils";
import { AvailableRegulations } from "../models/AvailableRegulations";
import { PayrollRegulations } from "../models/PayrollRegulations";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { PayrollData } from "./PayrollData";
import React from "react";

export type PayrollSettingsLoaderData = {
	payroll?: Payroll;
	payrollRegulations?: PayrollRegulations;
	availableRegulations: AvailableRegulations;
};

export function PayrollSettings() {
	const { payroll } = useLoaderData() as PayrollSettingsLoaderData;
	return (
		<ContentLayout title="Settings" key={payroll?.id}>
			<PayrollData />
			<PayrollTransmissionState />
			<Outlet />
		</ContentLayout>
	);
}

function PayrollTransmissionState() {
	const { payroll } = useLoaderData() as PayrollSettingsLoaderData;
	const { t } = useTranslation();
	if (!payroll) return;
	const text = payroll.transmissionStartDate
		? t(
				"{{name}} is live. Closing a period will transmit the documents to swissdec.",
				{ name: payroll.name },
			)
		: t("{{name}} is not live. Documents will not be sent to swissdec.", {
				name: payroll.name,
			});
	return (
		<Form method="POST">
			<Stack spacing={2}>
				<Typography variant="h6">{t("Transmission")}</Typography>
				<Typography>{text}</Typography>
				{!payroll.transmissionStartDate && (
					<Stack alignItems="end">
						<Button
							component={Link}
							to="golive"
							variant="contained"
							color="primary"
						>
							{t("Go live")}
						</Button>
					</Stack>
				)}
			</Stack>
		</Form>
	);
}

export function ConfirmTransmissionDialog() {
	const { payroll } = useRouteLoaderData("payrollSettings") as LoaderData;
	const openPayrunPeriod = useLoaderData() as PayrunPeriod;
	const { t } = useTranslation();
	if (!!payroll?.transmissionStartDate) {
		return <Navigate to=".." />;
	}
	return (
		<Dialog open>
			<DialogTitle>{t("Start transmission")}</DialogTitle>
			<DialogContent>
				<Typography>
					{t(
						"Starting with the currently open period {{periodDate}} the relevant documents will be sent to swissdec.",
						{ periodDate: formatDate(openPayrunPeriod.periodStart) },
					)}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button component={Link} to="..">
					{t("Back")}
				</Button>
				<Form method="POST">
					<input
						type="hidden"
						name="transmissionStartDate"
						value={openPayrunPeriod.periodStart as unknown as string}
					/>
					<Button type="submit" variant="contained">
						{t("Go live")}
					</Button>
				</Form>
			</DialogActions>
		</Dialog>
	);
}
