import { Suspense, useEffect, useState } from "react";
import {
	Stack,
	useMediaQuery,
	IconButton,
	Snackbar as MuiSnackbar,
	Alert,
	Typography,
	Box,
} from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./components/Logo";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// dynamically load these when we support more locales
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useAtom } from "jotai";
import { toastNotificationAtom } from "./utils/dataAtoms";
import { useRole } from "./user/utils";

export function App({ renderDrawer = false }) {
	const useTemporaryDrawer = useMediaQuery((theme) =>
		theme.breakpoints.down("lg"),
	);

	const [drawerOpen, setDrawerOpen] = useState(false);

	const drawerButton = useTemporaryDrawer && renderDrawer && (
		<IconButton size="large" onClick={() => setDrawerOpen(true)}>
			<MenuIcon />
		</IconButton>
	);
	const topbarLogo = !(renderDrawer && !useTemporaryDrawer) && (
		<Logo paddingLeft={drawerButton ? 0 : 16} />
	);

	return (
		<Stack className="app" direction="row">
			{renderDrawer && (
				<Drawer
					temporary={useTemporaryDrawer}
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
				/>
			)}
			<Stack sx={{ flex: 1, minWidth: 0 }}>
				<Topbar>
					{drawerButton}
					{topbarLogo}
				</Topbar>
				<Stack id="content" direction="row" sx={{ flex: 1, minWidth: 0 }}>
					<MainContainer />
					<Box
						id="sidebar-container"
						sx={{
							px: 3,
							maxWidth: 485,
							borderLeftColor: "divider",
							borderLeftStyle: "solid",
							borderLeftWidth: "thin",
						}}
					/>
				</Stack>
			</Stack>
			<Snackbar />
			<Suspense>
				<RenderProductionBanner />
			</Suspense>
		</Stack>
	);
}

const mainContainerProps = { px: 0, sm: { px: 0 } };
function MainContainer() {
	return (
		<Container component="main" maxWidth="lg" sx={mainContainerProps}>
			<Outlet />
		</Container>
	);
}

function Snackbar() {
	const { t } = useTranslation();
	const [toastNotification, setToastNotification] = useAtom(
		toastNotificationAtom,
	);
	const handleClose = () => setToastNotification(null);

	if (toastNotification === null) return null;

	return (
		<MuiSnackbar
			open
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			onClose={handleClose}
			autoHideDuration={5000}
		>
			<Alert severity={toastNotification.severity} variant="filled">
				<Typography>
					{t(toastNotification.message, toastNotification.messageArgs)}
				</Typography>
			</Alert>
		</MuiSnackbar>
	);
}

function RenderProductionBanner() {
	if (!import.meta.env.PROD) {
		return null;
	}
	const isInstanceAdmin = useRole("InstanceAdmin");
	useEffect(() => {
		const value = isInstanceAdmin ? "' '" : null;
		document.documentElement.style.setProperty("--production", value);
	}, [isInstanceAdmin]);
	return null;
}
