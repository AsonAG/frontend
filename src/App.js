import { useState, createContext } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Dossier from "./scenes/dossier";
import Tasks from "./scenes/tasks";
import PersonalCases from "./scenes/personalCases";
import CasesForm from "./scenes/global/CasesForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/employeeCases";
import EmployeeCase from "./scenes/case/EmployeeCase";
import PersonalCase from "./scenes/case/PersonalCase";
import CompanyCase from "./scenes/case/CompanyCase";
import { useEffect } from "react";
// import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react";
import LoginForm from "./scenes/login";

export const UserContext = createContext();
export const PayrollContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // const [caseName, onCaseSelect] = useState("");
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
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route
                        path="/tasks"
                        element={<Tasks />}
                      />
                      <Route
                        path="/company"
                        element={<CompanyCases />}
                      />
                      <Route
                        path="/employee"
                        element={<EmployeeCases />}
                      />
                      <Route
                        path="/personalCase"
                        element={<PersonalCase />}
                      />
                      <Route
                        path="/employeeCase"
                        element={<EmployeeCase />}
                      />
                      <Route
                        path="/companyCase"
                        element={<CompanyCase />}
                      />
                      <Route
                        path="/employees"
                        element={<Employees />}
                      />

                      <Route path="/dossier" element={<Dossier />} />
                      <Route
                        path="/reporting"
                        element={<PersonalCases />}
                      />

                      <Route path="/login" element={<LoginForm />} />
                    </Routes>
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
