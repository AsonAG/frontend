import { useMemo } from "react";
import {
	Button,
	Stack,
	TextField,
	FormControl,
	FormControlLabel,
	Checkbox,
	Typography,
} from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link as RouterLink, useLoaderData } from "react-router-dom";
import { Employee } from "../models/Employee";
import { Division } from "../models/Division";
import { UIFeatureQuery, UIFeature } from "../utils/UIFeature";

type LoaderData = {
	employee: Employee;
	divisions: Array<Division>;
	selectedDivisions: Array<string>;
};

export function EmployeeForm() {
	const { employee } = useLoaderData() as LoaderData;
	const isNew = !employee;
	const title = isNew ? "New employee" : "Edit employee";
	const { t } = useTranslation();
	const divisionAssignmentView = useMemo(() => <PayrollAssignmentView />, []);
	return (
		<Form method="post">
			<ContentLayout title={title}>
				<UIFeatureQuery
					feature={UIFeature.HrEmployeesEditFirstName}
					render={(enabled) => {
						if (!isNew && !enabled) {
							return (
								<Stack spacing={0.5}>
									<Typography variant="body2" color="text.secondary">
										{t("First name")}
									</Typography>
									<Typography variant="body1">{employee?.firstName}</Typography>
									<input
										type="hidden"
										name="firstName"
										value={employee?.firstName}
									/>
								</Stack>
							);
						}
						return (
							<TextField
								label={t("First name")}
								required
								name="firstName"
								defaultValue={employee?.firstName}
							/>
						);
					}}
				></UIFeatureQuery>
				<UIFeatureQuery
					feature={UIFeature.HrEmployeesEditLastName}
					render={(enabled) => {
						if (!isNew && !enabled) {
							return (
								<Stack spacing={0.5}>
									<Typography variant="body2" color="text.secondary">
										{t("Last name")}
									</Typography>
									<Typography variant="body1">{employee?.lastName}</Typography>
									<input
										type="hidden"
										name="lastName"
										value={employee?.lastName}
									/>
								</Stack>
							);
						}
						return (
							<TextField
								label={t("Last name")}
								required
								name="lastName"
								defaultValue={employee?.lastName}
							/>
						);
					}}
				></UIFeatureQuery>

				{!isNew && (
					<input type="hidden" name="status" value={employee.status} />
				)}
				<TextField
					label={t("Identifier")}
					required
					name="identifier"
					defaultValue={employee?.identifier}
				/>
				{divisionAssignmentView}
				<Stack direction="row" justifyContent="right" spacing={1}>
					<Button component={RouterLink} to=".." relative="path">
						{t("Back")}
					</Button>
					<Button type="submit" variant="contained">
						{t("Save")}
					</Button>
				</Stack>
			</ContentLayout>
		</Form>
	);
}

function PayrollAssignmentView() {
	const { divisions, selectedDivisions } = useLoaderData() as LoaderData;
	const { t } = useTranslation();
	return (
		<Stack display="none">
			<Typography variant="h6">{t("Organization unit assignment")}</Typography>
			{divisions.map((division) => {
				return (
					<FormControl key={division.id}>
						<FormControlLabel
							name="division"
							label={division.name}
							labelPlacement="end"
							control={
								<Checkbox
									defaultChecked={selectedDivisions.includes(division.id)}
									value={division.id}
									name="divisions"
								/>
							}
						/>
					</FormControl>
				);
			})}
		</Stack>
	);
}
