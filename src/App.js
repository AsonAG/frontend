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
import CaseForm from "./components/case/CaseForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/employeeCases";
import { useEffect } from "react";
// import { useAuth, useLoginWithRedirect, ContextHolder } from "@frontegg/react";
import { AuthProvider } from "oidc-react";
import LoginForm from "./scenes/login";
import Tenants from "./scenes/tenants";
import { PayrollsApi } from "./api/PayrollsApi";
import { ApiClient } from "./api/ApiClient";

export const EmployeeContext = createContext();
export const UserContext = createContext();
export const PayrollContext = createContext();


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
    userEmail: "",
    userId: "7",
    employeeId: "11",
    tenantId: null,
    divisionId: "7",
    currentPayrollId: "",
    currentPayrollName: "",
    availablePayrolls: [],
  });

  useEffect(() => {
    if (!user.tenantId) return;

    const apiClient = new ApiClient();
    apiClient.basePath = 'https://localhost:44354';
    var payrollsApi = new PayrollsApi(apiClient);
    payrollsApi.queryPayrolls(user.tenantId, null, onQueryPayrolls);
  }, [user.tenantId]);
  
  const onQueryPayrolls = function(error, data, response) {
    if (error) {
      console.log(error);
      return;
    }
    setUser(current => {
      let currentPayrollId = current.currentPayrollId
      // TODO AJO is name necessary?
      let currentPayrollName = current.currentPayrollName;
      if (!currentPayrollId && data.length > 0) {
        currentPayrollId = data[0].id;
        currentPayrollName = data[0].name;
      }
      return {
        ...current,
        currentPayrollId,
        currentPayrollName,
        availablePayrolls: data.map(payroll => ({payrollId: payroll.id, payrollName: payroll.name}))
      }
    });
  }


  const oidcConfig = {
    onSignIn: async(response) => {
      localStorage.setItem("ason_access_token", response.access_token);
      setUser({
        userEmail: response.email,
        // TODO UserId
        loaded: true,
        isAuthenticated: true,
        ...user
      });
      window.location.hash = "";
    },
    authority: "https://ason-01-p4mk1f.zitadel.cloud",
    clientId: "210272222781178113@ason",
    responseType: "code",
    redirectUri: "http://localhost:3003/",
    scope: "openid profile email"
  };

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
  let content;

  console.log("rerender");
  console.log(user);

  if (user.tenantId) {
    content = (
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
        </Box>
    )
  }
  else 
  {
    content = (
      <Tenants />
    )
  }

  return (
    <AuthProvider {...oidcConfig}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserContext.Provider value={{ user, setUser }}>
              {content}
            </UserContext.Provider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
