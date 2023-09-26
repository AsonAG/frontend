import React, { useState } from "react";
import { useCreateTheme } from "./theme";
import { CssBaseline, Divider, ThemeProvider, Stack, useMediaQuery, IconButton } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";

import 'dayjs/locale/de';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Outlet, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "./components/Logo";


dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale('de');

function App() {
	const { payrollId } = useParams();
	const theme = useCreateTheme();
	const useTemporaryDrawer = useMediaQuery(theme.breakpoints.down("lg"));
	
	const [drawerOpen, setDrawerOpen] = useState(false);
	const renderDrawer = !!payrollId;

	const drawerButton = useTemporaryDrawer && renderDrawer && <IconButton
		size="large"
		sx={{ mr: 2 }}
		onClick={() => setDrawerOpen(true)}
	>
		<MenuIcon />
	</IconButton>;
	const topbarLogo = !(renderDrawer && !useTemporaryDrawer) && <Logo />;
	
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Stack className="app" direction="row" sx={{backgroundColor: "background.main"}}>
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
