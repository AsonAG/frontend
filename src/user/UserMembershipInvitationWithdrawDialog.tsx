import { useMemo } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
	Link,
	useParams,
	useRouteLoaderData,
	useSubmit,
} from "react-router-dom";
import { UserMembershipInvitation } from "../models/User";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogTitle,
} from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";
import { getDisplayName } from "./utils";
import { IdType } from "../models/IdType";

type UserTableData = {
	userMembershipInvitations: Array<UserMembershipInvitation>;
	employees: Array<Employee>;
	employeeMap: Map<IdType, Employee>;
	payrolls: Array<Payroll>;
};

export function UserMembershipInvitationWithdrawDialogy() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const { invitationId } = useParams();

	const { userMembershipInvitations, employeeMap } = useRouteLoaderData(
		"userTable",
	) as UserTableData;

	const name = useMemo(() => {
		const invitation = userMembershipInvitations.find(
			(inv) => inv.id === invitationId,
		)!;
		return (
			getDisplayName(employeeMap.get(invitation.employeeId)) ?? invitation.email
		);
	}, [invitationId, userMembershipInvitations, employeeMap]);

	const onRemove = () => {
		submit(null, { method: "post", encType: "application/json" });
	};
	return (
		<ResponsiveDialog open>
			<ResponsiveDialogContent>
				<ResponsiveDialogTitle asChild>
					<Typography variant="h6">{t("Withdraw invitation")}</Typography>
				</ResponsiveDialogTitle>
				<ResponsiveDialogDescription asChild>
					<Typography>
						{t(
							"Do you want to withdraw the invitation for {{name}} to join the organization?",
							{ name },
						)}
					</Typography>
				</ResponsiveDialogDescription>
				<Stack direction="row" justifyContent="end" spacing={1}>
					<Button component={Link} to="..">
						{t("Cancel")}
					</Button>
					<Button variant="contained" color="destructive" onClick={onRemove}>
						{t("Withdraw")}
					</Button>
				</Stack>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
