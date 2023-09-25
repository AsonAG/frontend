
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
  getPayrolls, 
  getEmployees, 
  getEmployee, 
  getTenant, 
  getEmployeeCases, 
  getEmployeeCaseValues, 
  buildCase, 
  addCase,
  getUser,
  getEmployeeByIdentifier,
  getCompanyCases,
  getCompanyCaseValues
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
  loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, null, params.employeeId),
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
        const response = await addCase(params.tenantId, params.payrollId, caseChangeSetup, params.employeeId)
        if (response.ok) {
          return redirect("..");
        }
        // TODO  AJO validation errors
        return response;
      case "buildCase":
        return buildCase(params.tenantId, params.payrollId, params.caseName, caseChangeSetup, params.employeeId);
    } 
  }
}

const routeData = [
  {
    path: "/",
    element: <App />,
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
    element: <App />,
    loader: async ({params}) => {
      // TODO AJO optimize this to only query payrolls once...
      const payrolls = await getPayrolls(params.tenantId);
      if (!params.payrollId) {
        return redirect(payrolls[0].id + "");
      }
      const payroll = payrolls.find(p => p.id === Number(params.payrollId));

      const authUserEmail = getAuthUser()?.profile.email;
      const [tenant, user, employee] = await Promise.all([
        getTenant(params.tenantId),
        getUser(params.tenantId, authUserEmail),
        getEmployeeByIdentifier(params.tenantId, params.payrollId, authUserEmail)
      ]);
      
      return { tenant, user, payrolls, payroll, employee };
    },
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
        loader: ({params}) => getEmployees(params.tenantId, params.payrollId)
      },
      {
        path: "hr/employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="employee"/>,
        loader: async ({params}) => {
          const employee = await getEmployee(params.tenantId, params.employeeId);
          return { employee };
        },
        shouldRevalidate: ({currentParams, nextParams}) => currentParams.tenantId !== nextParams.tenantId || currentParams.employeeId !== nextParams.employeeId,
        id: "employee",
        children: [
          {
            index: true,
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "EmployeeData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly />,
            loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, null, params.employeeId)
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData
          },
          {
            path: "events",
            element: <EventsTable />,
            loader: ({params}) => getEmployeeCaseValues(params.tenantId, params.payrollId, params.employeeId)
          },
          {
            path: "documents",
            element: <DocumentsTable />,
            loader: ({params}) => getEmployeeCaseValues(params.tenantId, params.payrollId, params.employeeId, "DocumentCount gt 0")
          }
        ]
      },
      {
        path: "company",
        children: [
          {
            index: true,
            element: <CasesTable defaultTitle="Company Data" />,
            loader: ({params}) => getCompanyCases(params.tenantId, params.payrollId, "CompanyData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly defaultTitle="Company Data"/>,
            loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, null)
          },
          {
            path: "new",
            element: <CasesTable defaultTitle="New Company event" />,
            loader: ({params}) => getCompanyCases(params.tenantId, params.payrollId, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData,
            element: <CasesForm defaultTitle="New Company event" />
          },
          {
            path: "events",
            element: <EventsTable defaultTitle="Company events" />,
            loader: ({params}) => getCompanyCaseValues(params.tenantId, params.payrollId),

          },
          {
            path: "documents",
            element: <DocumentsTable defaultTitle="Company documents" />,
            loader: ({params}) => getCompanyCaseValues(params.tenantId, params.payrollId, "DocumentCount gt 0"),
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
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "EmployeeData"),
          },
          {
            path: ":caseName",
            element: <CasesForm displayOnly />,
            loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, null, params.employeeId)
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "ESS"),
          },
          {
            path: "new/:caseName",
            ...caseFormRouteData
          },
          {
            path: "tasks",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "ECT"),
          },
          {
            path: "tasks/:caseName",
            ...caseFormRouteData
          },
          {
            path: "documents",
            element: <DocumentsTable />,
            loader: ({params}) => getEmployeeCaseValues(params.tenantId, params.payrollId, params.employeeId, "DocumentCount gt 0")
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