import { Button, Stack, TextField } from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { useTranslation } from "react-i18next";
import { Form, Link as RouterLink, useLoaderData } from "react-router-dom";
import { Employee } from "../models/Employee";
import { UIFeatureQuery, UIFeature } from "../utils/UIFeature";

type LoaderData = {
	employee: Employee | null;
};

export function EmployeeForm() {
	const { employee } = useLoaderData() as LoaderData;
	const isNew = !employee;
	const title = isNew ? "New employee" : "Edit employee";
	const { t } = useTranslation();
	return (
		<Form method="post">
			<ContentLayout title={title}>
				<UIFeatureQuery
					feature={UIFeature.HrEmployeesEditFirstName}
					render={(enabled) => {
						const disabled = !isNew && !enabled;

						return (
							<>
								<TextField
									label={t("First name")}
									required
									name="firstName"
									defaultValue={employee?.firstName}
									disabled={disabled}
								/>
								{disabled && (
									<input
										type="hidden"
										name="firstName"
										value={employee.firstName}
									/>
								)}
							</>
						);
					}}
				></UIFeatureQuery>
				<UIFeatureQuery
					feature={UIFeature.HrEmployeesEditLastName}
					render={(enabled) => {
						const disabled = !isNew && !enabled;

						return (
							<>
								<TextField
									label={t("Last name")}
									required
									name="lastName"
									defaultValue={employee?.lastName}
									disabled={disabled}
								/>
								{disabled && (
									<input
										type="hidden"
										name="lastName"
										value={employee.lastName}
									/>
								)}
							</>
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
