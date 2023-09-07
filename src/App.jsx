import React, { useState, createContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Box } from "@mui/system";
import { ErrorBoundary } from "react-error-boundary";
import UnknownErrorPage from "./components/errors/UnknownErrorPage";
import { Outlet, useParams, useLoaderData } from "react-router-dom";


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
					<Box className="app">
						<ErrorBoundary
							FallbackComponent={UnknownErrorPage}
							onError={(error) =>
								console.error(JSON.stringify(error, null, 2))
							}
						>
							<Topbar
								isCollapsed={isSidebarCollapsed}
								toggleSidebar={toggleSidebar}
								renderSidebarButton={renderSidebar}
							/>
							<Box
								display="flex"
								flexDirection="row"
								width="100%"
								height="100%"
								paddingTop="60px"
							>
								{ renderSidebar && <Sidebar isCollapsed={isSidebarCollapsed} /> }
								<main className="content">
									<Outlet context={loaderContent}/>
								</main>
							</Box>
						</ErrorBoundary>
					</Box>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</LocalizationProvider>
	);
}

export default App;
