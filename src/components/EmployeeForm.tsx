import React from "react";
import {
	Button,
	Stack,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link as RouterLink, useLoaderData } from "react-router-dom";

export function EmployeeForm() {
	const employee = useLoaderData() as any;
	const isNew = !employee;
	const divisions = JSON.stringify(employee?.divisions);
	const title = isNew ? "New employee" : "Edit employee";
	const { t } = useTranslation();
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
				{!isNew && (
					<input type="hidden" name="identifier" value={employee?.identifier} />
				)}
				{!isNew && <StatusSelect status={employee.status} />}
				<TextField
					label={t("Identifier")}
					required
					name="identifier"
					defaultValue={employee?.identifier}
					disabled={!isNew}
				/>
				<input type="hidden" name="divisions" value={divisions} />
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

function StatusSelect({ status }) {
	const { t } = useTranslation();
	const label = t("Status");
	return (
		<FormControl fullWidth>
			<InputLabel id="active-select-label">{label}</InputLabel>
			<Select
				size="small"
				labelId="active-select-label"
				name="status"
				defaultValue={status}
				label={label}
			>
				<MenuItem value="Active">{t("Active")}</MenuItem>
				<MenuItem value="Inactive">{t("Inactive")}</MenuItem>
			</Select>
		</FormControl>
	);
}
