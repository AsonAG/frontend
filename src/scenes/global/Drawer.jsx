import {
	Box,
	Divider,
	Toolbar,
	Drawer as MuiDrawer,
	Typography,
	Badge,
} from "@mui/material";
import { Suspense, forwardRef, useEffect } from "react";
import {
	NavLink as RouterLink,
	useLoaderData,
	useLocation,
	useMatches,
	useParams,
} from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { PayrollSelector } from "../../components/selectors/PayrollSelector";
import { Stack } from "@mui/system";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import PaymentsIcon from '@mui/icons-material/Payments';

import Logo from "../../components/Logo";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { companyMissingDataCountAtom, openTasksAtom, showOrgSelectionAtom, ESSMissingDataAtom, hideReportsFeatureAtom, missingDataEmployeesAtom } from "../../utils/dataAtoms";
import { Description } from "@mui/icons-material";
import { useRole } from "../../hooks/useRole";

const Link = styled(
	forwardRef(function Link(itemProps, ref) {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)(({ theme }) => {
	return {
		display: "block",
		textDecoration: "none",
		padding: theme.spacing(1),
		borderRadius: theme.spacing(1),
		color: theme.palette.text.primary,
		"&:hover": {
			color: theme.palette.primary.main,
			backgroundColor: theme.palette.primary.hover,
		},
		"&.active": {
			color: theme.palette.primary.main,
			backgroundColor: theme.palette.primary.active,
		},
		"&.active:hover": {
			color: theme.palette.primary.light,
		},
	};
});

function NavigationItem(props) {
	const { icon, label, to, end, activeOn } = props;
	const matches = useMatches();
	let active = false;
	if (activeOn) {
		active = matches.some(match => match.id === activeOn);
	}

	return (
		<Link to={to} end={end} className={active ? "active" : undefined}>
			<Stack direction="row" spacing={1}>
				{icon}
				<Typography sx={{ flexGrow: 1 }}>{label}</Typography>
			</Stack>
		</Link>
	);
}

function OpenTasksBadgeIcon() {
	const icon = <FormatListBulletedIcon />;
	return (
		<Suspense fallback={icon}>
			<AtomBadge atom={openTasksAtom} color="warning">{icon}</AtomBadge>
		</Suspense>
	);
}

function CompanyBadgeIcon({ icon }) {
	return (
		<Suspense fallback={icon}>
			<AtomBadge atom={companyMissingDataCountAtom} color="warning" countFunc={count => count}>
				{icon}
			</AtomBadge>
		</Suspense>
	);
}

function EmployeeBadgeIcon({ icon }) {
	const count = (data) =>
		data.map((x) => x.cases?.length ?? 0).reduce((a, b) => a + b, 0);
	return (
		<Suspense fallback={icon}>
			<AtomBadge atom={missingDataEmployeesAtom} color="warning" countFunc={count}>
				{icon}
			</AtomBadge>
		</Suspense>
	);
}

function EmployeeMissingDataBadge({ icon }) {
	const count = (cases) => {
		return cases?.length ?? 0;
	};
	return (
		<Suspense fallback={icon}>
			<AtomBadge atom={ESSMissingDataAtom} color="warning" countFunc={count}>
				{icon}
			</AtomBadge>
		</Suspense>
	);

}

function defaultCount(data) {
	return data.count;
}
function AtomBadge({ atom, color = "primary", countFunc = defaultCount, children }) {
	const data = useAtomValue(atom);
	const count = countFunc(data);
	return (
		<Badge badgeContent={count} color={color} overlap="circular">
			{children}
		</Badge >
	);
}

function NavigationMenu({ children }) {
	return (
		<Box component="nav" sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
			{children}
		</Box>
	);
}

function NavigationGroup({ name, children, hidden = false }) {
	if (hidden) {
		return null;
	}
	return (
		<Box sx={{ py: 0.5 }}>
			{name && (
				<Typography p={1} variant="body1" color="text.secondary">
					{name}
				</Typography>
			)}
			{children}
		</Box>
	);
}

function MenuItemsOrganization() {
	const { t } = useTranslation();
	return (
		<NavigationGroup>
			<NavigationItem
				label={t("Employees")}
				to="employees"
				icon={<PeopleOutlinedIcon />}
			/>
			<NavigationItem
				label={t("Settings")}
				to="settings"
				icon={<SettingsIcon />}
			/>
		</NavigationGroup>
	);
}

function MenuItemsPayrollAdmin() {
	const { t } = useTranslation();
	const hideReports = useAtomValue(hideReportsFeatureAtom);
	return (
		<NavigationGroup>
			<NavigationItem
				label={t("Company")}
				to="company"
				icon={<CompanyBadgeIcon icon={<BusinessIcon />} />}
			/>
			<NavigationItem
				label={t("Employees")}
				to="hr/employees"
				icon={<PeopleOutlinedIcon />}
			/>
			<NavigationItem
				label={t("Missing data")}
				to="hr/missingdata"
				icon={<EmployeeBadgeIcon icon={<NotificationImportantIcon />} />}
			/>
			<NavigationItem
				label={t("Payroll")}
				to="payrunperiods/open"
				activeOn="payrunperiods-root"
				icon={<PaymentsIcon />} />
			{!hideReports &&
				<NavigationItem
					label={t("Reports")}
					to="hr/reports"
					icon={<Description />}
				/>
			}
			<NavigationItem
				label={t("Tasks")}
				to="hr/tasks"
				icon={<OpenTasksBadgeIcon />}
			/>
		</NavigationGroup>
	)
}

function MenuItemsPayrollEmployee({ employee }) {
	const { t } = useTranslation();
	return (
		<NavigationGroup>
			<NavigationItem
				label={t("New event")}
				to={`employees/${employee.id}/new`}
				icon={<AddOutlinedIcon />}
			/>
			<NavigationItem
				label={t("Missing data")}
				to={`employees/${employee.id}/missingdata`}
				icon={<EmployeeMissingDataBadge employeeId={employee.id} icon={<NotificationImportantIcon />} />}
			/>
			<NavigationItem
				label={t("Documents")}
				to={`employees/${employee.id}/documents`}
				icon={<DescriptionOutlinedIcon />}
			/>
		</NavigationGroup>
	);
}

function MenuItemsUnknown() {
	const { t } = useTranslation();
	return <Typography>{t("No features available for this user")}</Typography>
}

function MenuItems() {
	const { employee } = useLoaderData();
	const { payrollId } = useParams();
	const isAdmin = useRole("admin");
	const isEmployee = useRole("user");
	if (!payrollId && isAdmin) {
		return <MenuItemsOrganization />;
	}
	else if (payrollId && isAdmin) {
		return <MenuItemsPayrollAdmin />;
	}
	else if (payrollId && isEmployee && employee) {
		return <MenuItemsPayrollEmployee employee={employee} />;
	}
	else {
		return <MenuItemsUnknown />;
	}

}

const drawerWidth = 265;
function Drawer({ temporary, open, onClose }) {
	const location = useLocation();
	const { t } = useTranslation();

	useEffect(onClose, [location]);

	const drawerVariant = temporary ? "temporary" : "permanent";

	return (
		<MuiDrawer
			variant={drawerVariant}
			open={open}
			onClose={onClose}
			PaperProps={{
				elevation: 0,
			}}
			sx={{
				width: drawerWidth,
				px: 0.5,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					boxSizing: "border-box",
					border: "none",
				},
			}}
		>
			<Toolbar disableGutters sx={{ px: 2 }}>
				<Logo />
				<Divider
					orientation="vertical"
					variant="middle"
					flexItem
					sx={{ mx: 2 }}
				/>
				<Stack spacing={0.5} sx={{ flex: 1 }} alignItems="flex-start" pt={0.5}>
					<Typography
						variant="body2"
						color="text.secondary"
						fontWeight="bold"
						px={1}
					>
						{t("Organization unit")}
					</Typography>
					<PayrollSelector />
				</Stack>
			</Toolbar>
			<Divider />
			<Stack
				sx={{
					flexGrow: 1,
					border: 0,
					borderRight: 1,
					borderStyle: "solid",
					borderColor: "divider",
					overflowY: "auto",
				}}
			>
				<NavigationMenu>
					<MenuItems />
				</NavigationMenu>
				<Suspense>
					<OrganizationSection />
				</Suspense>
			</Stack>
		</MuiDrawer>
	);
}

function OrganizationSection() {
	const { t } = useTranslation();
	const { org } = useLoaderData();
	const isProvider = useRole("provider");
	const showOrgSelection = useAtomValue(showOrgSelectionAtom);
	if (!isProvider && !showOrgSelection)
		return null;

	return (
		<>
			<Divider />
			<Stack sx={{ p: 2 }} spacing={1}>
				<Typography>{t("Organization")}</Typography>
				<Stack spacing={1} direction="row">
					<Typography
						variant="body2"
						textOverflow="ellipsis"
						overflow="hidden"
					>
						{org.identifier}
					</Typography>
					<Typography
						component={RouterLink}
						variant="body2"
						color="primary.main"
						to="/orgs"
						sx={{
							textDecoration: "none",
							"&: hover": {
								fontWeight: "bold",
							},
						}}
					>
						{t("Select...")}
					</Typography>
				</Stack>
			</Stack>
		</>
	);

}

export default Drawer;
