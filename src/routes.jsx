
import * as React from "react";

import { createBrowserRouter, Navigate, useLoaderData } from "react-router-dom";

import Tenants from "./scenes/tenants";
import Dashboard from "./scenes/dashboard";
import Employees from "./scenes/employees";
import CasesTable from "./components/tables/CasesTable";
import EventsTable from "./components/tables/EventsTable";
import DocumentsTable from "./components/tables/DocumentsTable";
import CasesForm from "./scenes/global/CasesForm";

import App from "./App";

import { getTenants, getPayrolls, getEmployees, getEmployee, getTenant, getEmployeeCases, getEmployeeCaseValues, getCase } from "./api/FetchClient";
import EmployeeView from "./scenes/employees/EmployeeView";

function PayrollRedirect() {
  const payrolls = useLoaderData();
  if (!payrolls) {
    return null;
  }

  const firstPayrollId = payrolls[0].id + "";

  return <Navigate to={firstPayrollId} replace />;
}

export default createBrowserRouter([
  {
    path: "/",
    element: <App key="root" />,
    children: [
      {
        index: true,
        element: <Navigate to="tenants" replace />, 
      },
      {
        path: "tenants",
        element: <Tenants />,
        loader: getTenants,
        id: "tenants",
      },
      {
        path: "tenants/:tenantId/payrolls",
        id: "payrolls",
        loader: ({params}) => getPayrolls(params.tenantId),
        element: <PayrollRedirect />
      },
    ]
  },
  {
    path: "tenants/:tenantId/payrolls/:payrollId",
    element: <App key="root" />,
    loader: async ({params}) => {
      let response = await getTenant(params.tenantId);
      const tenant = await response.json();
      console.log("tenant loader");
      return {tenant};
    },
    // shouldRevalidate: (params) => { console.log(params); return false},
    id: "root",
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "hr/employees",
        element: <Employees />,
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
            // TODO AJO TEST
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "EmployeeData"),
          },
          {
            path: "new",
            element: <CasesTable />,
            loader: ({params}) => getEmployeeCases(params.tenantId, params.payrollId, params.employeeId, "NotAvailable"),
          },
          {
            path: "new/:caseName",
            element: <CasesForm />, // TODO AJO fix header
            loader: ({params}) => getCase(params.tenantId, params.payrollId, params.caseName, params.employeeId),
            // TODO AJO action
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
]);