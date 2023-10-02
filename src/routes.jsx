
import * as React from "react";

import { createBrowserRouter, Navigate, redirect } from "react-router-dom";

import Tenants from "./scenes/tenants";
import Dashboard from "./scenes/dashboard";
import EmployeesTable from "./components/tables/EmployeesTable";
import CasesTable from "./components/tables/CasesTable";
import EventsTable from "./components/tables/EventsTable";
import DocumentsTable from "./components/tables/DocumentsTable";
import CasesForm from "./scenes/global/CasesForm";
import getAuthUser from "./auth/getUser";

import App from "./App";

// TODO AJO error states when network requests fail
// TODO AJO DEMOGROUP -> COMPANY -> NEW EVENT -> ZAHLT DIE FIRMA EINEN 13. MONATSLOHN AUS? -> error
import { 
  getTenants,
  getEmployees,
  getEmployee,
  getEmployeeCases,
  getEmployeeCaseValues,
  getEmployeeByIdentifier,
  getCompanyCases,
  getCompanyCaseValues,
  tenantDataCache
} from "./api/FetchClient";
import EmployeeView from "./scenes/employees/EmployeeView";

function tenantDataAwareLoader(loader) {
  return async (props) => {
    if (!props.params.tenantId) {
      throw new Error("No tenant found");
    }
    const tenantData = await tenantDataCache.getData(props.params.tenantId);
    return loader({...tenantData, ...props});
  }
}

const routeData = [
  {
    path: "/",
    element: <App />,
    loader: () => {return {user: null};},
    children: [
      {
        index: true,
        element: <Navigate to="tenants" replace />, 
      },
      {
        path: "tenants",
        element: <Tenants />,
        loader: getTenants,
      }
    ]
  },
  {
    path: "tenants/:tenantId/payrolls/:payrollId?",
    element: <App renderDrawer />,
    loader: tenantDataAwareLoader(async ({params, tenant, user, payrolls}) => {
      if (!params.payrollId) {
        return redirect(payrolls[0].id + "");
      }
      const payroll = payrolls.find(p => p.id === Number(params.payrollId));
      const authUserEmail = getAuthUser()?.profile.email;
      const employee = await getEmployeeByIdentifier(params, authUserEmail);
      return { tenant, user, payrolls, payroll, employee };
    }),
    shouldRevalidate: ({currentParams, nextParams}) => currentParams.tenantId !== nextParams.tenantId || currentParams.payrollId !== nextParams.payrollId,
    id: "root",
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "hr/employees",
        element: <EmployeesTable />,
        loader: ({params}) => getEmployees(params)
      },
      {
        path: "hr/employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="employee"/>,
        loader: async ({params}) => {
          const employee = await getEmployee(params);
          return { employee };
        },
        shouldRevalidate: ({currentParams, nextParams}) => currentParams.tenantId !== nextParams.tenantId || currentParams.employeeId !== nextParams.employeeId,
        id: "employee",
        children: [
          {
            index: true,
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "EmployeeData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly />
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            Component: CasesForm,
          },
          {
            path: "events",
            element: <EventsTable />,
            loader: ({params}) => getEmployeeCaseValues(params)
          },
          {
            path: "documents",
            element: <DocumentsTable />,
            loader: ({params}) => getEmployeeCaseValues(params, "DocumentCount gt 0")
          }
        ]
      },
      {
        path: "company",
        children: [
          {
            index: true,
            element: <CasesTable defaultTitle="Company Data" />,
            loader: ({params}) => getCompanyCases(params, "CompanyData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly defaultTitle="Company Data"/>
          },
          {
            path: "new",
            element: <CasesTable defaultTitle="New Company event" />,
            loader: ({params}) => getCompanyCases(params, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            element: <CasesForm defaultTitle="New Company event" />
          },
          {
            path: "events",
            element: <EventsTable defaultTitle="Company events" />,
            loader: ({params}) => getCompanyCaseValues(params),

          },
          {
            path: "documents",
            element: <DocumentsTable defaultTitle="Company documents" />,
            loader: ({params}) => getCompanyCaseValues(params, "DocumentCount gt 0"),
          }
        ]
      },
      {
        path: "employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="root" />,
        children: [
          {
            index: true,
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "EmployeeData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly />
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "ESS"),
          },
          {
            path: "new/:caseName",
            Component: CasesForm
          },
          {
            path: "tasks",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "ECT"),
          },
          {
            path: "tasks/:caseName",
            Component: CasesForm,
          },
          {
            path: "documents",
            element: <DocumentsTable />,
            loader: ({params}) => getEmployeeCaseValues(params, "DocumentCount gt 0")
          }
        ]
      },
    ]
  }
];

const browserRouter = createBrowserRouter(routeData,
{
  future: {
    v7_normalizeFormMethod: true
  }
});

export { routeData, browserRouter };