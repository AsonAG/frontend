
import * as React from "react";

import { createBrowserRouter, Navigate, redirect, useLoaderData } from "react-router-dom";

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
  getEmployeeByIdentifier
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

export default createBrowserRouter([
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

      // TODO AJO query in parallel
      const tenant = await getTenant(params.tenantId);
      
      const authUser = getAuthUser();

      const user = await getUser(params.tenantId, authUser.email);

      const employee = await getEmployeeByIdentifier(params.tenantId, payroll.divisionId, authUser.email);

      
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
        // TODO AJO add payrollid or division id
        loader: ({params}) => getEmployees(params.tenantId)
      },
      {
        path: "hr/employees/:employeeId",
        element: <EmployeeView />,
        loader: ({params}) => getEmployee(params.tenantId, params.employeeId),
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
            loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, params.employeeId)
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            element: <CasesForm />,
            loader: ({params}) => buildCase(params.tenantId, params.payrollId, params.caseName, params.employeeId),
            shouldRevalidate: ({actionResult}) => !actionResult,
            action: async ({request, params}) => {
              const { caseData, intent, userId, divisionId, attachments } = await request.json();
              const caseChangeSetup = {
                userId,
                divisionId,
                employeeId: Number(params.employeeId),
                case: mapCase(caseData, attachments)
              }

              switch (intent) {
                case "addCase":
                  const response = await addCase(params.tenantId, params.payrollId, params.employeeId, caseChangeSetup)
                  if (response.ok) {
                    throw redirect("../new");
                  }
                  // TODO validation errors
                  return response;
                case "buildCase":
                  return buildCase(params.tenantId, params.payrollId, params.caseName, params.employeeId, caseChangeSetup);
              } 
            }
          },
          {
            path: "events",
            element: <EventsTable />,
            loader: ({params}) => getEmployeeCaseValues(params.tenantId, params.payrollId, params.employeeId),

          },
          {
            path: "documents",
            element: <DocumentsTable />,
            loader: ({params}) => getEmployeeCaseValues(params.tenantId, params.payrollId, params.employeeId, {filter: "DocumentCount gt 0"}),
          }
        ]
      },
    ]
  }
],
{
  future: {
    v7_normalizeFormMethod: true
  }
});