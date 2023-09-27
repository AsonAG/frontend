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


dayjs.extend(utc);
dayjs.extend(localizedFormat);

// need to hardcode supported locales
// vite (atm) can't deal with dynamic dayjs imports
const supportedLocales = {
	"de": () => import("dayjs/locale/de"),
	"en": () => import("dayjs/locale/en")
};


function App({renderDrawer = false}) {
	const theme = useCreateTheme();
	const useTemporaryDrawer = useMediaQuery(theme.breakpoints.down("lg"));
	const { user } = useLoaderData();
	
	useEffect(() => {
		const [locale] = user?.culture.split("-") ?? ['en'];
		supportedLocales[locale]().then(() => dayjs.locale(locale));
	}, [user?.culture]);

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
