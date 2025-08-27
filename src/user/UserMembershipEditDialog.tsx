import { useMemo, useState } from "react";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
	Link,
	useParams,
	useRouteLoaderData,
	useSubmit,
} from "react-router-dom";
import { UserMembership } from "../models/User";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogTitle,
} from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";
import {
	RoleSelection,
	RoleSelectionState,
	useRoleSelection,
} from "./RoleSelection";
import { EmployeeSelection } from "./EmployeeSelection";
import { getDisplayName } from "./utils";

type UserTableData = {
	userMemberships: Array<UserMembership>;
	employees: Array<Employee>;
	payrolls: Array<Payroll>;
	employeesWithoutMemberships: Array<Employee>;
};

export function UserMembershipEditDialog() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const { userMembershipId } = useParams();

	const { userMemberships, payrolls, employees, employeesWithoutMemberships } =
		useRouteLoaderData("userTable") as UserTableData;

	const userMembership = useMemo(
		() => userMemberships.find((user) => user.id === userMembershipId)!,
		[userMembershipId, userMemberships],
	);
	const membershipEmployee = useMemo(
		() =>
			employees.find((employee) => employee.id === userMembership.employeeId) ??
			null,
		[employees, userMembership],
	);
	const employeeList = useMemo(() => {
		if (membershipEmployee) {
			return [membershipEmployee, ...employeesWithoutMemberships];
		}
		return employeesWithoutMemberships;
	}, [employeesWithoutMemberships, membershipEmployee]);
	const [employee, setEmployee] = useState<Employee | null>(membershipEmployee);

	const [state, dispatch] = useRoleSelection(userMembership.role);
	const onSave = () => {
		submit(
			{ ...userMembership, role: state.role, employeeId: employee?.id ?? null },
			{ method: "post", encType: "application/json" },
		);
	};
	const displayName =
		getDisplayName(employee) ?? getDisplayName(userMembership);

	const disabledHelpText = getDisabledText(state, employee);
	return (
		<ResponsiveDialog open>
			<ResponsiveDialogContent>
				<ResponsiveDialogTitle asChild>
					<Typography variant="h6">
						{t("Update membership of {{name}}", { name: displayName })}
					</Typography>
				</ResponsiveDialogTitle>
				<EmployeeSelection
					employee={employee}
					onChange={setEmployee}
					employees={employeeList}
				/>
				<Typography>{t("Choose a role")}</Typography>
				<RoleSelection state={state} dispatch={dispatch} payrolls={payrolls} />
				<Stack direction="row" justifyContent="end" spacing={1}>
					<Button component={Link} to="..">
						{t("Cancel")}
					</Button>
					<Tooltip title={t(disabledHelpText)}>
						<span>
							<Button
								variant="contained"
								color="primary"
								onClick={onSave}
								disabled={!!disabledHelpText}
							>
								{t("Save")}
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

function getDisabledText(
	state: RoleSelectionState,
	employee: Employee | null,
): string {
	if (state.role === null) {
		if (state.selectedRole === "PayrollManager") {
			return "Select at least one payroll";
		}
	}
	if (state.selectedRole === "SelfService" && employee === null) {
		return "Employee is required";
	}
	return "";
}
