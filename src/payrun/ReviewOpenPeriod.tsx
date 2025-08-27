import React, { Suspense, useMemo, useState } from "react";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import {
	Await,
	Form,
	useLoaderData,
	useNavigation,
	useRouteLoaderData,
} from "react-router-dom";
import {
	Alert,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
	Typography,
} from "@mui/material";
import { PayrunPeriod } from "../models/PayrunPeriod";
import { Employee } from "../models/Employee";

import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../components/ResponsiveDialog";
import { DashboardHeader } from "./DashboardHeader";
import { PeriodDocuments } from "./PeriodDocuments";
import { PayrunPeriodLoaderData } from "./PayrunPeriodLoaderData";

export function ReviewOpenPeriod() {
	const { t } = useTranslation();
	const { documents } = useLoaderData();
	const { payroll, payrunPeriod, controllingData } = useRouteLoaderData(
		"payrunperiod",
	) as PayrunPeriodLoaderData;
	const navigation = useNavigation();
	const hasOpenPayouts = useMemo(
		() => payrunPeriod.entries.some((entry) => entry.openPayout > 0),
		[payrunPeriod.entries],
	);
	const [openPayoutConfirmation, setOpenPayoutConfirmation] = useState(false);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOpenPayoutConfirmation(event.target.checked);
	};
	const hasUnresolvedControllingCases =
		controllingData.companyControllingCases.length > 0 ||
		controllingData.employeeControllingCases.length > 0;
	return (
		<>
			<ContentLayout title={<DashboardHeader />}>
				<PeriodDocuments />
				{hasUnresolvedControllingCases && (
					<Alert severity="error" color="warning">
						<Typography>
							{t(
								"The wage controlling has not been completed yet. The period cannot be closed.",
							)}
						</Typography>
					</Alert>
				)}
				<Stack direction="row" justifyContent="end">
					<ResponsiveDialog>
						<Suspense
							fallback={
								<Button variant="contained" color="primary" disabled>
									{t("Close period")}
								</Button>
							}
						>
							<Await
								resolve={documents}
								errorElement={
									<Button variant="contained" color="primary" disabled>
										{t("Close period")}
									</Button>
								}
							>
								{() => (
									<ResponsiveDialogTrigger>
										<Button
											variant="contained"
											color="primary"
											disabled={hasUnresolvedControllingCases}
										>
											{t("Close period")}
										</Button>
									</ResponsiveDialogTrigger>
								)}
							</Await>
						</Suspense>
						<ResponsiveDialogContent>
							<Typography variant="h6">{t("Close period")}</Typography>
							<Typography>
								{t("A closed period cannot be reopened.")}
							</Typography>
							{!!payroll.transmissionStartDate ? (
								<Typography>
									{t(
										"Upon closing the period, these documents will be sent to swissdec.",
									)}
								</Typography>
							) : (
								<Alert severity="warning">
									<Typography>
										{t(
											"The organisation unit is not live. Documents will not be sent to swissdec.",
										)}
									</Typography>
								</Alert>
							)}
							{hasOpenPayouts && (
								<>
									<Alert severity="warning">
										<Typography>
											{t("There are employees with open payouts!")}
										</Typography>
									</Alert>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													checked={openPayoutConfirmation}
													onChange={handleChange}
												/>
											}
											label={t(
												"Do you want to move all open payouts to the next period?",
											)}
										/>
									</FormGroup>
								</>
							)}
							<Stack direction="row" justifyContent="end" spacing={2}>
								<ResponsiveDialogClose>
									<Button>{t("Cancel")}</Button>
								</ResponsiveDialogClose>
								<Form method="post">
									<input
										type="hidden"
										name="payrunPeriodId"
										value={payrunPeriod.id}
									/>
									<Button
										variant="contained"
										type="submit"
										color="primary"
										disabled={hasOpenPayouts && !openPayoutConfirmation}
										loading={navigation.state === "submitting"}
									>
										{t("Close period")}
									</Button>
								</Form>
							</Stack>
						</ResponsiveDialogContent>
					</ResponsiveDialog>
				</Stack>
			</ContentLayout>
		</>
	);
}

type LoaderData = {
	employees: Array<Employee>;
	payrunPeriod: PayrunPeriod;
};
