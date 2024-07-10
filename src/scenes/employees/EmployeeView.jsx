import {
	Navigate,
	useOutlet,
	useLoaderData,
	NavLink as RouterLink,
	Outlet,
} from "react-router-dom";
import { ContentLayout, PageHeaderTitle } from "../../components/ContentLayout";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit } from "@mui/icons-material";
import { StatusChip } from "./StatusChip";
import { useMissingDataCount } from "../../utils/dataAtoms";
import { getEmployeeDisplayString } from "../../models/Employee";
import { TabLink } from "../../components/TabLink";


export function EmployeeView() {
	const outlet = useOutlet();
	const { employee } = useLoaderData();
	const { t } = useTranslation();
	const missingDataCount = useMissingDataCount(employee.id);
	const isActive = employee.status === "Active";
	const header = getEmployeeDisplayString(employee);

	if (!outlet) {
		const to = isActive ? "new" : "events";
		return <Navigate to={to} replace />;
	}
	const title = (
		<Stack direction="row" spacing={1} flex={1} alignItems="center" width="100%">
			<PageHeaderTitle title={header} />
			<Tooltip title={t("Edit employee")} placement="top" arrow size="sm">
				<IconButton
					component={RouterLink}
					to="edit"
					color="primary"
					size="small"
				>
					<Edit />
				</IconButton>
			</Tooltip>
			<StatusChip status={employee.status} />
		</Stack>
	);
	return (
		<ContentLayout title={title}>
			<Stack direction="row" spacing={2} flexWrap="wrap">
				{isActive && <TabLink title={t("New event")} to="new" />}
				<TabLink title={t("Events")} to="events" />
				<TabLink title={t("Documents")} to="documents" />
				{isActive && missingDataCount && (
					<TabLink
						title={t("Missing data")}
						to="missingdata"
						badgeCount={missingDataCount}
					/>
				)}
			</Stack>
			{outlet}
		</ContentLayout>
	);
}

export function EmployeeTitle() {
	const employee = useLoaderData();
	return (
		<ContentLayout title={getEmployeeDisplayString(employee)}>
			<Outlet />
		</ContentLayout>
	);
}
