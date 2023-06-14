import { useState, createContext, useMemo } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Tasks from "./scenes/tasks";
import PersonalCases from "./scenes/casesList/PersonalCases";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Box } from "@mui/system";
import CompanyCases from "./scenes/casesList/CompanyCases";
import Employees from "./scenes/employees";
import EmployeeCases from "./scenes/casesList/EmployeeCases";
import EmployeeCase from "./scenes/case/EmployeeCase";
import PersonalCase from "./scenes/case/PersonalCase";
import CompanyCase from "./scenes/case/CompanyCase";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "oidc-react";
import ApiClient from "./api/ApiClient";
import PayrollsApi from "./api/PayrollsApi";
import Tenants from "./scenes/tenants";
import UsersApi from "./api/UsersApi";
import de from "date-fns/locale/de";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import EmployeesApi from "./api/EmployeesApi";
import authConfig from "./authConfig";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBar from "./components/errors/ErrorBar";
import UnknownErrorPage from "./components/errors/UnknownErrorPage";
import CompanyData from "./scenes/data/CompanyData";
import EmployeeData from "./scenes/data/EmployeeData";
import CompanyDataCase from "./scenes/data/dataCase/CompanyDataCase";
import EmployeeDataCase from "./scenes/data/dataCase/EmployeeDataCase";
import PersonalData from "./scenes/data/PersonalData";
import PersonalDataCase from "./scenes/data/dataCase/PersonalDataCase";

export const UserContext = createContext();
export const UserEmployeeContext = createContext();
export const EmployeeSelectionContext = createContext();
export const ErrorBarContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [employee, setEmployee] = useSessionStorage("employee_selection", {});
  const [userEmployee, setUserEmployee] = useLocalStorage("user_employee", {});
  const [authUserIdentifier, setAuthUserIdentifier] = useLocalStorage("authUserIdentifier", {});
  const [user, setUser] = useState({});
  const [error, setError] = useState();

  const payrollsApi = useMemo(
    () => new PayrollsApi(ApiClient, user.tenantId),
    [user.tenantId]
  );
  const usersApi = useMemo(
    () => new UsersApi(ApiClient, user.tenantId),
    [user.tenantId]
  );
  const employeesApi = useMemo(() => new EmployeesApi(ApiClient, user), [user]);

  // TODO: change title dependently on a chosen Route path
  useEffect(() => {
    document.title = user.currentPayrollName
      ? "Ason - " + user.currentPayrollName
      : "Ason - Tenants";
  }, [user.currentPayrollName]);

  useEffect(() => {
    if (user.tenantId && authUserIdentifier) {
      setEmployee({});
      setUserEmployee({});
      usersApi.getUsers(onGetUsersCallback);
    }
  }, [user.tenantId, authUserIdentifier]);

  useEffect(() => {
    if (user.attributes) {
      payrollsApi.getPayrolls(onGetPayrollsCallback);
      employeesApi.getEmployees(onGetEmployeesCallbck);
    }
  }, [user.attributes]);

  const onGetUsersCallback = (error, data, response) => {
    if (error) {
      console.error(error);
      return;
    }
    let userData = data.find(
      // (element) => element.identifier === auth.userData?.profile?.email
      (element) => element.identifier === authUserIdentifier
    );

    setUser({
      ...user,
      identifier: authUserIdentifier,
      userId: userData.id,
      culture: userData.culture,
      language: userData.language,
      attributes: userData.attributes,
    });
  };

  const onGetPayrollsCallback = (error, data, response) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(JSON.stringify(data));
    setUser(() => {
      let currentPayrollId = user.currentPayrollId;
      let currentPayrollName = user.currentPayrollName;
      let currentDivisionId = user.currentDivisionId;

      let userPayrolls = data.filter((payroll) =>
        user.attributes.payrolls.includes(payroll.name)
      );

      if (!currentPayrollId && userPayrolls.length > 0) {
        // TODO: current payroll choice based on attribute.startPayroll
        currentPayrollId = userPayrolls[0].id;
        currentPayrollName = userPayrolls[0].name;
        currentDivisionId = userPayrolls[0].divisionId;
      }
      return {
        ...user,
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

  const onGetEmployeesCallbck = (error, data, response) => {
    let employee;

    if (error) {
      console.error(error);
    } else {
      employee = data.find(
        (element) => element.identifier === user.attributes.employee
      );
      employee.employeeId = employee.id;
      setUserEmployee(employee);
    }
  };

  let content;

  console.log("Rerender with user: " + JSON.stringify(user));
  if (user.tenantId) {
    content = (
      <Box
        className="app"
        // display="flex"
        // flexDirection="column"
      >
      {/* <ErrorBoundary
        FallbackComponent={UnknownErrorPage}
        onError={(error) => console.error(JSON.stringify(error, null, 2))}
      > */}
        <Topbar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <Box display="flex" flexDirection="row" width="100%" height="100%" paddingTop="60px">
          <Sidebar isCollapsed={isSidebarCollapsed} />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />

              <Route path="/employee" element={<EmployeeCases />} />
              <Route path="/company" element={<CompanyCases />} />

              <Route path="/personalCase" element={<PersonalCase />} />
              <Route path="/employeeCase" element={<EmployeeCase />} />
              <Route path="/companyCase" element={<CompanyCase />} />

              <Route path="/personalData" element={<PersonalData />} />
              <Route path="/employeeData" element={<EmployeeData />} />
              <Route path="/companyData" element={<CompanyData />} />

              <Route path="/personalDataCase" element={<PersonalDataCase />} />
              <Route path="/companyDataCase" element={<CompanyDataCase />} />
              <Route path="/employeeDataCase" element={<EmployeeDataCase />} />
              
              <Route path="/ECT" element={<Tasks />} />
              <Route path="/ESS" element={<PersonalCases />} />

              {/* <Route path="/documents" element={<Documents />} /> */}
            </Routes>
          </main>
        </Box>
            {/* </ErrorBoundary> */}
      </Box>
    );
  } else {
    content = <Tenants />;
  }

  return (
    <AuthProvider {...authConfig(setAuthUserIdentifier)}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={de} // TODO: user default selection and manual selection option
      >
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <UserContext.Provider value={{ user, setUser }}>
              <EmployeeSelectionContext.Provider
                value={{ employee, setEmployee }}
              >
                <UserEmployeeContext.Provider value={userEmployee}>
                  {content}
                </UserEmployeeContext.Provider>
              </EmployeeSelectionContext.Provider>
            </UserContext.Provider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
