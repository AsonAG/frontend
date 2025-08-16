import React, { Suspense, useEffect, useState } from "react";
import { useCreateTheme } from "./theme";
import {
	CssBaseline,
	ThemeProvider,
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
import { Outlet, useLoaderData } from "react-router-dom";
import { Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./components/Logo";
import { useTranslation } from "react-i18next";
import { getLanguageCode } from "./services/converters/LanguageConverter";
import { getDateLocale } from "./services/converters/DateLocaleExtractor";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

// dynamically load these when we support more locales
import "dayjs/locale/de";
import "dayjs/locale/en";
import { useAtom } from "jotai";
import { toastNotificationAtom } from "./utils/dataAtoms";
import { User } from "./models/User";
import { useRole } from "./user/utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type LoaderData = {
	user: User
};

export function App({ renderDrawer = false }) {
	const theme = useCreateTheme();
	const useTemporaryDrawer = useMediaQuery(theme.breakpoints.down("lg"));
	const { user } = useLoaderData() as LoaderData;
	const { i18n } = useTranslation();

	useEffect(() => {
		dayjs.locale(getDateLocale(user));
		const languageCode = getLanguageCode(user?.language);
		i18n.changeLanguage(languageCode);
	}, [user?.culture, user?.language]);

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
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getDateLocale(user)}>
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
							<Box id="sidebar-container" sx={{ px: 3, maxWidth: 485, borderLeftColor: "divider", borderLeftStyle: "solid", borderLeftWidth: "thin" }} />
						</Stack>
					</Stack>
					<Snackbar />
					<Suspense>
						<RenderProductionBanner />
					</Suspense>
				</Stack>
			</LocalizationProvider>
		</ThemeProvider>
	);
}

const mainContainerProps = { px: 0, sm: { px: 0 } };
function MainContainer() {
	return (
		<Container component="main" maxWidth="lg" sx={mainContainerProps}>
			<Outlet />
		</Container>
	)
}

function Snackbar() {
	const { t } = useTranslation();
	const [toastNotification, setToastNotification] = useAtom(toastNotificationAtom);
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
				<Typography>{t(toastNotification.message, toastNotification.messageArgs)}</Typography>
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
		document.documentElement.style.setProperty('--production', value);
	}, [isInstanceAdmin]);
	return null;
}
