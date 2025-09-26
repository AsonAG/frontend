import { useMemo } from "react";
import { Button, Stack, Typography } from "@mui/material";
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
	ResponsiveDialogDescription,
	ResponsiveDialogTitle,
} from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";

type UserTableData = {
	userMemberships: Array<UserMembership>;
	employees: Array<Employee>;
	payrolls: Array<Payroll>;
};

export function UserMembershipRemoveDialog() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const { userMembershipId } = useParams();

	const { userMemberships } = useRouteLoaderData("userTable") as UserTableData;

	const name = useMemo(() => {
		const userMembership = userMemberships.find(
			(user) => user.id === userMembershipId,
		)!;
		return `${userMembership.firstName} ${userMembership.lastName}`;
	}, [userMembershipId, userMemberships]);

	const onRemove = () => {
		submit(null, { method: "post", encType: "application/json" });
	};
	return (
		<ResponsiveDialog open>
			<ResponsiveDialogContent>
				<ResponsiveDialogTitle asChild>
					<Typography variant="h6">{t("Remove user")}</Typography>
				</ResponsiveDialogTitle>
				<ResponsiveDialogDescription asChild>
					<Typography>
						{t("Do you want to remove {{name}} from the organization?", {
							name,
						})}
					</Typography>
				</ResponsiveDialogDescription>
				<Stack direction="row" justifyContent="end" spacing={1}>
					<Button component={Link} to="..">
						{t("Cancel")}
					</Button>
					<Button variant="contained" color="destructive" onClick={onRemove}>
						{t("Remove")}
					</Button>
				</Stack>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
