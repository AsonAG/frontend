import { Button, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { ContentLayout } from "../components/ContentLayout";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import { UserMembership, UserMembershipInvitation } from "../models/User";
import { Add, Edit } from "@mui/icons-material";
import { Employee } from "../models/Employee";
import { useMemo } from "react";
import { IdType } from "../models/IdType";
import dayjs from "dayjs";
import { getDisplayName } from "./utils";
import { UIFeatureGate, UIFeature } from "../utils/UIFeature";

type LoaderData = {
	userMemberships: Array<UserMembership>;
	userMembershipInvitations: Array<UserMembershipInvitation>;
	employees: Array<Employee>;
	employeeMap: Map<IdType, Employee>;
	employeesWithoutMemberships: Array<Employee>;
};

export function UserMembershipTable() {
	const {
		userMemberships,
		userMembershipInvitations,
		employeesWithoutMemberships,
	} = useLoaderData() as LoaderData;
	const { t } = useTranslation();

	return (
		<ContentLayout title={t("Users")} buttons={<InviteButton />}>
			<Stack spacing={1}>
				{userMemberships.map((membership) => (
					<UserMembershipRow key={membership.id} membership={membership} />
				))}
				{userMembershipInvitations.map((invitation) => (
					<UserMembershipInvitationRow
						key={invitation.id}
						invitation={invitation}
					/>
				))}
			</Stack>
			<Stack spacing={1}>
				<Typography variant="h6">{t("Employees without access")}</Typography>
				{employeesWithoutMemberships.map((employee) => (
					<EmployeeInvitationRow key={employee.id} employee={employee} />
				))}
			</Stack>
			<Outlet />
		</ContentLayout>
	);
}

function InviteButton() {
	const { t } = useTranslation();
	return (
		<UIFeatureGate feature={UIFeature.UsersInvite}>
			<Button
				variant="outlined"
				component={Link}
				to="invite"
				startIcon={<Add />}
				size="small"
			>
				<Typography>{t("Invite")}</Typography>
			</Button>
		</UIFeatureGate>
	);
}

function UserMembershipRow({ membership }: { membership: UserMembership }) {
	const { t } = useTranslation();
	const { employeeMap } = useLoaderData() as LoaderData;
	const displayName =
		getDisplayName(employeeMap.get(membership.employeeId)) ??
		getDisplayName(membership);
	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<Stack direction="row" flex={1} spacing={1.5} alignItems="center">
				<Typography variant="body1">{displayName}</Typography>
				{!membership.employeeId && (
					<Tooltip
						title={t(
							"This user is not assigned to an employee of the organization",
						)}
					>
						<Chip variant="outlined" label={t("external")} size="small" />
					</Tooltip>
				)}
			</Stack>
			<UIFeatureGate feature={UIFeature.UsersEditRole}>
				<EditUserRolesButton membership={membership} />
			</UIFeatureGate>
			<UIFeatureGate feature={UIFeature.UsersRemove}>
				<Button
					component={Link}
					variant="outlined"
					to={`memberships/${membership.id}/remove`}
					size="small"
					color="destructive"
				>
					{t("Remove")}
				</Button>
			</UIFeatureGate>
		</Stack>
	);
}
function UserMembershipInvitationRow({
	invitation,
}: {
	invitation: UserMembershipInvitation;
}) {
	const { t } = useTranslation();
	const { employeeMap } = useLoaderData() as LoaderData;
	const displayName =
		getDisplayName(employeeMap.get(invitation.employeeId)) ?? invitation.email;
	const isExpired = useMemo(
		() => dayjs.utc(invitation.expiresAt).isBefore(dayjs.utc()),
		[invitation.expiresAt],
	);
	const chip = isExpired ? (
		<Chip variant="outlined" label={t("expired")} size="small" />
	) : (
		<Chip
			variant="outlined"
			label={t("pending")}
			size="small"
			color="warning"
		/>
	);

	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<Stack direction="row" flex={1} spacing={1.5} alignItems="center">
				<Typography variant="body1">{displayName}</Typography>
				{chip}
			</Stack>
			<Button variant="outlined" disabled size="small">
				<Typography>{t("rolename_" + invitation.role.$type)}</Typography>
			</Button>
			{!isExpired && (
				<Button
					component={Link}
					variant="outlined"
					to={`invitations/${invitation.id}/withdraw`}
					size="small"
					color="destructive"
				>
					{t("Withdraw")}
				</Button>
			)}
		</Stack>
	);
}

function EmployeeInvitationRow({ employee }: { employee: Employee }) {
	const { t } = useTranslation();
	return (
		<Stack direction="row" spacing={2} alignItems="center">
			<Typography variant="body1" flex={1}>
				{employee.firstName} {employee.lastName}
			</Typography>
			<UIFeatureGate feature={UIFeature.UsersInvite}>
				<Button
					component={Link}
					variant="outlined"
					to={`invite/${employee.id}`}
					size="small"
				>
					{t("Invite")}
				</Button>
			</UIFeatureGate>
		</Stack>
	);
}

function EditUserRolesButton({ membership }: { membership: UserMembership }) {
	const { t } = useTranslation();
	const disabled = membership.role.$type === "Owner";
	return (
		<Button
			component={Link}
			variant="outlined"
			to={`memberships/${membership.id}/edit`}
			disabled={disabled}
			size="small"
			startIcon={!disabled && <Edit />}
		>
			<Typography>{t("rolename_" + membership.role.$type)}</Typography>
		</Button>
	);
}
