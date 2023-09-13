import React, { useState, createContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, Divider, ThemeProvider, Stack } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Drawer from "./scenes/global/Drawer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ErrorBoundary } from "react-error-boundary";
import UnknownErrorPage from "./components/errors/UnknownErrorPage";
import { Outlet, useParams, useLoaderData } from "react-router-dom";
import { Box } from "@mui/material";


export const ErrorBarContext = createContext();

dayjs.extend(utc);

// TODO AJO document title
// TODO AJO fetch user/employee
// TODO AJO finish payroll selection
// TODO AJO handle tenant selection state
function App() {
	const loaderContent = useLoaderData();
	const { payrollId } = useParams();
	const [theme, colorMode] = useMode();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const renderSidebar = !!payrollId;
	const toggleSidebar = () => setIsSidebarCollapsed(collapsed => !collapsed);

	return (
		// TODO: user default selection and manual selection option
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
							{ renderSidebar && <Drawer isCollapsed={isSidebarCollapsed} /> }
							<Stack sx={{flexGrow: 1}} divider={<Divider />}>
								<Topbar
									isCollapsed={isSidebarCollapsed}
									toggleSidebar={toggleSidebar}
									renderSidebarButton={false}
								/>
								<Box component="main" sx={{flexGrow: 1}} className="main content">
									<Outlet context={loaderContent}/>
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
