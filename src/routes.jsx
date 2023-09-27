
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
  buildCase,
  addCase,
  getEmployeeByIdentifier,
  getCompanyCases,
  getCompanyCaseValues,
  tenantDataCache
} from "./api/FetchClient";
import EmployeeView from "./scenes/employees/EmployeeView";


function mapCase(_case, attachments) {
  return {
    caseName: _case.name,
    values: _case.fields.map(f => ({
      caseName: _case.name,
      caseFieldName: f.name,
      value: f.value,
      start: f.start,
      end: f.end,
      documents: attachments[f.id]
    })),
    relatedCases: _case.relatedCases.map(c => mapCase(c, attachments))
  };
}

const caseFormRouteData = {
  element: <CasesForm />,
  loader: ({params}) => buildCase(params, null),
  shouldRevalidate: ({actionResult}) => !actionResult,
  action: async ({request, params}) => {
    const { caseData, intent, userId, divisionId, attachments } = await request.json();
    const caseChangeSetup = {
      userId,
      divisionId,
      case: mapCase(caseData, attachments)
    }
    if (params.employeeId) {
      caseChangeSetup.employeeId = Number(params.employeeId);
    }

    switch (intent) {
      case "addCase":
        const response = await addCase(params, caseChangeSetup)
        if (response.ok) {
          return redirect("..");
        }
        // TODO  AJO validation errors
        return response;
      case "buildCase":
        return buildCase(params, caseChangeSetup);
    } 
  }
}


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
            element: <CasesForm displayOnly />,
            loader: ({params}) => buildCase(params, null)
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData
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
            element: <CasesForm displayOnly defaultTitle="Company Data"/>,
            loader: ({params}) => buildCase(params, null)
          },
          {
            path: "new",
            element: <CasesTable defaultTitle="New Company event" />,
            loader: ({params}) => getCompanyCases(params, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData,
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
            element: <CasesForm displayOnly />,
            loader: ({params}) => buildCase(params, null)
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "ESS"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData
          },
          {
            path: "tasks",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params, "ECT"),
          },
          {
            path: "tasks/:caseName",
            ...caseFormRouteData
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