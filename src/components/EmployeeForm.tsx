import React, { useMemo } from "react";
import {
	Button,
	Stack,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Typography,
} from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link as RouterLink, useLoaderData } from "react-router-dom";
import { Employee } from "../models/Employee";
import { Division } from "../models/Division";

type LoaderData = {
	employee: Employee,
	divisions: Array<Division>,
	selectedDivisions: Array<string>
}

export function EmployeeForm() {
	const { employee, } = useLoaderData() as LoaderData;
	const isNew = !employee;
	const title = isNew ? "New employee" : "Edit employee";
	const { t } = useTranslation();
	const divisionAssignmentView = useMemo(() => <PayrollAssignmentView />, []);
	return (
		<Form method="post">
			<ContentLayout title={title}>
				<TextField
					label={t("First name")}
					required
					name="firstName"
					defaultValue={employee?.firstName}
				/>
				<TextField
					label={t("Last name")}
					required
					name="lastName"
					defaultValue={employee?.lastName}
				/>
				{!isNew && <input type="hidden" name="status" value={employee.status} />}
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
			{
				divisions.map(division => {
					return (
						<FormControl key={division.id}>
							<FormControlLabel
								name="division"
								label={division.name}
								labelPlacement="end"
								control={<Checkbox defaultChecked={selectedDivisions.includes(division.name)} value={division.name} name="divisions" />}
							/>
						</FormControl>
					);
				})
			}
		</Stack>
	)
}
