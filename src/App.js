import { useState, createContext, useMemo } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Dossier from "./scenes/dossier";
import Tasks from "./scenes/tasks";
import PersonalCases from "./scenes/personalCases";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box, height } from "@mui/system";
import CompanyCases from "./scenes/companyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/employees/employeeCases";
import EmployeeCase from "./scenes/case/EmployeeCase";
import PersonalCase from "./scenes/case/PersonalCase";
import CompanyCase from "./scenes/case/CompanyCase";
import { useEffect } from "react";
import { AuthProvider } from "oidc-react";
import LoginForm from "./scenes/login";
import User from "./model/User";
import ApiClient from "./api/ApiClient";
import PayrollsApi from "./api/PayrollsApi";
import CasesForm from "./scenes/global/CasesForm";
import Tenants from "./scenes/tenants";
import UsersApi from "./api/UsersApi";

export const UserContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const payrollsApi = useMemo(
    () => new PayrollsApi(ApiClient, user.tenantId),
    [user.tenantId]
  );
  const usersApi = useMemo(
    () => new UsersApi(ApiClient, user.tenantId),
    [user.tenantId]
  );

  useEffect(() => {
    document.title = "Ason Payroll";
  }, []);

  useEffect(() => {
    if (!user.tenantId) {
      navigate("/");
      return;
    } else {
      usersApi.getUsers(onGetUsersCallback);
    }
  }, [user.tenantId]);

  useEffect(() => {
    if (!user.attributes) {
      return;
    } else {
      payrollsApi.getPayrolls(onGetPayrollsCallback);
    }
  }, [user.attributes]);

  // useEffect(() => {
  //   if (!user.tenantId) return;
  //   usersApi.getUsers(onGetUsersCallback);
  //   payrollsApi.getPayrolls(onGetPayrollsCallback);
  // }, [user.attributes.payrolls]);

  const onGetUsersCallback = (error, data, response) => {
    if (error) {
      console.log(error);
      return;
    }
    setUser((current) => ({
      ...current,
      userId: data[0].id,
      culture: data[0].culture,
      language: data[0].language,
      attributes: data[0].attributes,
      employee: {
        // TODO, get employee from the request instead
        employeeId: 15,
      },
    }));
  };

  const onGetPayrollsCallback = (error, data, response) => {
    if (error) {
      console.log(error);
      return;
    }
    setUser((current) => {
      let currentPayrollId = current.currentPayrollId;
      let currentPayrollName = current.currentPayrollName;
      let currentDivisionId = current.currentDivisionId;

      let userPayrolls = data.filter(
        (payroll) => payroll.name in current.attributes.payrolls
      );

      if (!currentPayrollId && userPayrolls.length > 0) {
        currentPayrollId = userPayrolls[0].id;
        currentPayrollName = userPayrolls[0].name;
        currentDivisionId = userPayrolls[0].divisionId;
      }
      return {
        ...current,
        currentPayrollId,
        currentPayrollName,
        currentDivisionId,
        availablePayrolls: userPayrolls.map((payroll) => ({
          payrollId: payroll.id,
          payrollName: payroll.name,
          divisionId: payroll.divisionId,
        })),
      };
    });
  };

  const oidcConfig = {
    onSignIn: async (response) => {
      localStorage.setItem("ason_access_token", response.access_token);
      setUser({
        userEmail: response.email,
        // TODO UserId
        loaded: true,
        isAuthenticated: true,
        ...user,
      });
      window.location.hash = "";
    },
    authority: "https://ason-01-p4mk1f.zitadel.cloud",
    clientId: "210272222781178113@ason",
    responseType: "code",
    redirectUri: "http://localhost:3003/",
    scope: "openid profile email",
  };

  const logout = () => {
    setUser((current) => ({
      ...current,
      isAuthenticated: false,
      loaded: false,
    }));
    navigate("/login");
  };
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
        <Box display="flex" flexDirection="row" width="100%" marginTop="60px">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/company" element={<CompanyCases />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employee" element={<EmployeeCases />} />
              <Route path="/personalCase" element={<PersonalCase />} />
              <Route path="/employeeCase" element={<EmployeeCase />} />
              <Route path="/companyCase" element={<CompanyCase />} />

              <Route path="/dossier" element={<Dossier />} />
              <Route path="/reporting" element={<PersonalCases />} />

              <Route path="/login" element={<LoginForm />} />
            </Routes>
          </main>
        </Box>
      </Box>
    );
  } else {
    content = <Tenants />;
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
