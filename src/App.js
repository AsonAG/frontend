import { useState, createContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Dossier from "./scenes/dossier";
import Tasks from "./scenes/tasks";
import Reporting from "./scenes/reporting";
import CaseForm from "./scenes/global/case/CaseForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/employeeCases";
import { useEffect } from "react";
import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react"; 
import LoginForm from "./scenes/login";


export const EmployeeContext = createContext();
export const UserContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [caseName, setCaseName] = useState("");
  const [employeeChoice, setEmployeeChoice] = useState({});
  const navigate = useNavigate();

  // const { user, isAuthenticated } = useAuth();
  // const loginWithRedirect = useLoginWithRedirect();
  // const logout = () => {
  //   const baseUrl = ContextHolder.getContext().baseUrl;
  //   window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  // };
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     loginWithRedirect();
  //   }
  // }, [isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    document.title = "Ason Payroll";
  }, []);

  const [user, setUser] = useState({
    loaded: false,
    isAuthenticated: false,
    userId: "",
    employeeId: "",
    payrollId: "",
    payrollName: "XYZ Payroll",
  });
  
  const logout = () => {
    setUser(current => ({
            ...current,
            isAuthenticated: false,
    }));
    navigate("/login");
  }; 
  useEffect(() => {
      if (user.isAuthenticated) {
        navigate("/");
      }
    }, [user]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <div className="app">
            <UserContext.Provider value={{ user, setUser }}>
              <Topbar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
                handleLogout={logout}
              />
              <Box
                display="flex"
                flexDirection="row"
                width="100%"
                marginTop="60px"
              >
                <Sidebar isCollapsed={isSidebarCollapsed} />
                <main className="content">
                  <EmployeeContext.Provider
                    value={{ employeeChoice, setEmployeeChoice }}
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/tasks"
                        element={<Tasks updateCaseName={setCaseName} />}
                      />
                      <Route
                        path="/company"
                        element={<CompanyCases updateCaseName={setCaseName} />}
                      />
                      <Route
                        path="/employee"
                        element={<EmployeeCases updateCaseName={setCaseName} />}
                      />
                      <Route
                        path="/case"
                        element={<CaseForm caseName={caseName} />}
                      />

                      <Route
                        path="/employees"
                        element={<Employees updateCaseName={setCaseName} />}
                      />

                      <Route path="/dossier" element={<Dossier />} />
                      <Route
                        path="/reporting"
                        element={<Reporting updateCaseName={setCaseName} />}
                      />

                      <Route path="/login" element={<LoginForm />} />
                    </Routes>
                  </EmployeeContext.Provider>
                </main>
              </Box>
            </UserContext.Provider>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
