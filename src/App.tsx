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
	Breakpoint,
} from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Outlet, useLoaderData, useMatches } from "react-router-dom";
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
import { useAtom, useAtomValue } from "jotai";
import { toastNotificationAtom } from "./utils/dataAtoms";
import { User } from "./models/User";
import { useRole } from "./hooks/useRole";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

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
		</ThemeProvider>
	);
}

const mainContainerProps = { px: 0, sm: { px: 0 } };
function MainContainer() {
	const containerWidth = useContainerWidth();
	return (
		<Container component="main" maxWidth={containerWidth} sx={mainContainerProps}>
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
				<Typography>{t(toastNotification.message)}</Typography>
			</Alert>
		</MuiSnackbar>
	);
}

function RenderProductionBanner() {
	if (!import.meta.env.PROD) {
		return null;
	}
	const isProvider = useRole("provider");
	useEffect(() => {
		const value = isProvider ? "' '" : null;
		document.documentElement.style.setProperty('--production', value);
	}, [isProvider]);
	return null;
}

function useContainerWidth(): Breakpoint | false {
	const matches = useMatches();
	const last = matches[matches.length - 1].id;
	const fullContainerWidth = useAtomValue(fullContainerWidthSettingAtom);
	if (last in fullContainerWidth && fullContainerWidth[last]) {
		return false;
	}
	return "lg";
}

export type FullContainerWidthSetting = Record<string, boolean>

const jsonLocalStorage = createJSONStorage<FullContainerWidthSetting>(() => localStorage);

const defaultFullContainerWidthSetting: FullContainerWidthSetting = {};

export const fullContainerWidthSettingAtom = atomWithStorage<FullContainerWidthSetting>("settings.view.fullContainerWidth", defaultFullContainerWidthSetting, jsonLocalStorage, { getOnInit: true });

export function useContainerWidthSetting(view: string): [boolean, (value: boolean) => void] {
	const [fullWidth, setFullWidth] = useAtom(fullContainerWidthSettingAtom);
	function setContainerWidth(checked: boolean) {
		setFullWidth({ ...fullWidth, [view]: checked })
	}
	return [fullWidth[view] ?? false, setContainerWidth];
}
