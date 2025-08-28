import { useMemo, useState } from "react";
import {
	Button,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
	Link,
	useActionData,
	useLoaderData,
	useParams,
	useRouteLoaderData,
	useSubmit,
} from "react-router-dom";
import { UserMembershipInvitation, UserRole } from "../models/User";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogTitle,
} from "../components/ResponsiveDialog";
import { Employee } from "../models/Employee";
import { Payroll } from "../models/Payroll";
import { Share } from "@mui/icons-material";
import { toast } from "../utils/dataAtoms";
import {
	RoleSelection,
	RoleSelectionState,
	useRoleSelection,
} from "./RoleSelection";
import { IdType } from "../models/IdType";
import { EmployeeSelection } from "./EmployeeSelection";

type LoaderData = {
	employeeEmail: string | null;
};

type UserTableData = {
	employeeMap: Map<IdType, Employee>;
	employeesWithoutMemberships: Array<Employee>;
	payrolls: Array<Payroll>;
};

export function UserMembershipInviteDialog() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const { employeeId } = useParams() as { employeeId: IdType };
	const { employeeEmail } = useLoaderData() as LoaderData;
	const { employeesWithoutMemberships, payrolls, employeeMap } =
		useRouteLoaderData("userTable") as UserTableData;
	const [email, setEmail] = useState<string>(employeeEmail ?? "");
	const invitation = useActionData() as UserMembershipInvitation | undefined;

	const selectedEmployee = useMemo(
		() => employeeMap.get(employeeId) ?? null,
		[employeeMap, employeeId],
	);
	const initialRole: UserRole = !!selectedEmployee
		? { $type: "SelfService" }
		: { $type: "Admin" };
	const [state, dispatch] = useRoleSelection(initialRole);

	const onInvite = () => {
		submit(
			{
				email,
				role: state.role,
				employeeId: selectedEmployee?.id ?? null,
			},
			{ method: "post", encType: "application/json" },
		);
	};

	if (invitation) {
		const link = `${window.location.origin}/invitation/${invitation.id}`;
		function onShare() {
			navigator.clipboard.writeText(link);
			toast("success", "Copied to clipboard");
		}
		return (
			<ResponsiveDialog open>
				<ResponsiveDialogContent>
					<ResponsiveDialogTitle asChild>
						<Typography variant="h6">{t("Invitation has been created!")}</Typography>
					</ResponsiveDialogTitle>
					<Typography>
						{t("Send this link to the user with the email {{email}}.", {
							email: invitation.email,
						})}
					</Typography>
					<Stack direction="row" spacing={1}>
						<TextField
							value={link}
							label={t("Invitation link")}
							fullWidth
							disabled
						/>
						<IconButton onClick={onShare}>
							<Share />
						</IconButton>
					</Stack>
					<Stack direction="row" justifyContent="end" spacing={1}>
						<Button component={Link} to="..">
							{t("Go back")}
						</Button>
					</Stack>
				</ResponsiveDialogContent>
			</ResponsiveDialog>
		);
	}

	const disabledText = getDisabledText(state, email);
	return (
		<ResponsiveDialog open>
			<ResponsiveDialogContent>
				<ResponsiveDialogTitle asChild>
					<Typography variant="h6">{t("Invite to organization")}</Typography>
				</ResponsiveDialogTitle>
				{!!selectedEmployee && (
					<EmployeeSelection
						employee={selectedEmployee}
						onChange={() => { }}
						employees={[]}
						disabled
					/>
				)}
				<TextField
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<ResponsiveDialogDescription asChild>
					<Typography>{t("Choose a role")}:</Typography>
				</ResponsiveDialogDescription>
				<RoleSelection state={state} dispatch={dispatch} payrolls={payrolls} />
				<Stack direction="row" justifyContent="end" spacing={1}>
					<Button component={Link} to="..">
						{t("Cancel")}
					</Button>
					<Tooltip title={t(disabledText)}>
						<span>
							<Button
								variant="contained"
								color="primary"
								onClick={onInvite}
								disabled={!!disabledText}
							>
								{t("Invite")}
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

function getDisabledText(state: RoleSelectionState, email: string): string {
	if (state.role === null) {
		if (state.selectedRole === "PayrollManager") {
			return "Select at least one payroll";
		}
	}
	if (!email) {
		return "Email is required";
	}
	return "";
}
