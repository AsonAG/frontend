import React, { useEffect, useState } from "react";
import { useCreateTheme } from "./theme";
import { CssBaseline, Divider, ThemeProvider, Stack, useMediaQuery, IconButton } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Outlet, useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "./components/Logo";
import { useTranslation } from "react-i18next";
import { getLanguageCode } from "./services/converters/LanguageConverter";
import { getDateLocale } from "./services/converters/DateLocaleExtractor";


dayjs.extend(utc);
dayjs.extend(localizedFormat);

// dynamically load these when we support more locales
import "dayjs/locale/de";
import "dayjs/locale/en";


function App({renderDrawer = false}) {
	const theme = useCreateTheme();
	const useTemporaryDrawer = useMediaQuery(theme.breakpoints.down("lg"));
	const { user } = useLoaderData();
	const { i18n } = useTranslation();
	
	useEffect(() => {
		dayjs.locale(getDateLocale(user))
		const languageCode = getLanguageCode(user?.language);
		i18n.changeLanguage(languageCode);

	}, [user?.culture, user?.language]);

	const [drawerOpen, setDrawerOpen] = useState(false);

	const drawerButton = useTemporaryDrawer && renderDrawer && 
		<IconButton size="large" onClick={() => setDrawerOpen(true)}>
			<MenuIcon />
		</IconButton>;
	const topbarLogo = !(renderDrawer && !useTemporaryDrawer) && <Logo />;
	
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Stack className="app" direction="row">
				{renderDrawer && <Drawer temporary={useTemporaryDrawer} open={drawerOpen} onClose={() => setDrawerOpen(false)} /> }
				<Stack sx={{flexGrow: 1}} divider={<Divider />}>
					<Topbar>
						{drawerButton}
						{topbarLogo}
					</Topbar>
					<Box component="main" sx={{flexGrow: 1}} className="main content">
						<Outlet />
					</Box>
				</Stack>
			</Stack>
		</ThemeProvider>
	);
}

export default App;
