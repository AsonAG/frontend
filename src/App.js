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
import CasesForm from "./scenes/global/CasesForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/employeeCases";
import { useEffect } from "react";
// import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react";
import LoginForm from "./scenes/login";

export const EmployeeContext = createContext();
export const UserContext = createContext();
export const PayrollContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [caseName, onCaseSelect] = useState("");
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

  const onCaseSelect = (caseName) => {
    window.sessionStorage.setItem("caseName", caseName);
  };

  const [user, setUser] = useState({
    loaded: false,
    isAuthenticated: false,
    userEmail: "",
    // userId: "10",
    // employeeId: "10",
    // tenantId: "5",
    // divisionId: "6",
    // currentPayrollId: "6",
    // currentPayrollName: "CaseDefPayroll.Derived",
    userId: "1",
    employeeId: "1",
    tenantId: "1",
    divisionId: "1",
    currentPayrollId: "1",
    currentPayrollName: "CH",
    availablePayrolls: [
      // {
      //   payrollId: "6",
      //   payrollName: "CaseDefPayroll.Derived",
      // },
      {
        payrollId: "1",
        payrollName: "CH",
      },
      {
        payrollId: "2",
        payrollName: "AT",
      },
      {
        payrollId: "3",
        payrollName: "BH",
      },
      {
        payrollId: "4",
        payrollName: "Demo Switzerland AG",
      },
    ],
  });

  const logout = () => {
    setUser((current) => ({
      ...current,
      isAuthenticated: false,
      loaded: false
    }));
    navigate("/login");
  };
  // useEffect(() => {
  //   console.log(user.currentPayrollId);
  //   if (user.isAuthenticated) {
  //     // navigate("/");
  //   } else navigate("/login");
  // }, [user]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserContext.Provider value={{ user, setUser }}>
            <Box 
              className="app" 
              // display="flex" 
              // flexDirection="column"
            >
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
                        element={<Tasks updateCaseName={onCaseSelect} />}
                      />
                      <Route
                        path="/company"
                        element={<CompanyCases updateCaseName={onCaseSelect} />}
                      />
                      <Route
                        path="/employee"
                        element={<EmployeeCases updateCaseName={onCaseSelect} />}
                      />
                      <Route
                        path="/case"
                        element={<CasesForm />} // TODO: Change caseName param to Router Path Param
                      />

                      <Route
                        path="/employees"
                        element={<Employees updateCaseName={onCaseSelect} />}
                      />

                      <Route path="/dossier" element={<Dossier />} />
                      <Route
                        path="/reporting"
                        element={<Reporting updateCaseName={onCaseSelect} />}
                      />

                      <Route path="/login" element={<LoginForm />} />
                    </Routes>
                  </EmployeeContext.Provider>
                </main>
              </Box>
            </Box>
          </UserContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
