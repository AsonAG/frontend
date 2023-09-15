import React, { useState, createContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, Divider, ThemeProvider, Stack, useMediaQuery, IconButton } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ErrorBoundary } from "react-error-boundary";
import UnknownErrorPage from "./components/errors/UnknownErrorPage";
import { Outlet, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "./components/Logo";


export const ErrorBarContext = createContext();

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale('de');

function App() {
	const { payrollId } = useParams();
	const [theme, colorMode] = useMode();
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
		// TODO AJO: user default selection and manual selection option
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ErrorBoundary
						FallbackComponent={UnknownErrorPage}
						onError={(error) =>
							console.error(JSON.stringify(error, null, 2))
						}
					>
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
					</ErrorBoundary>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</LocalizationProvider>
	);
}

export default App;
