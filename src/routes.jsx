
import * as React from "react";

import { createBrowserRouter, defer, Navigate, redirect } from "react-router-dom";

import Tenants from "./scenes/tenants";
import Dashboard from "./scenes/dashboard";
import { AsyncEmployeeTable } from "./components/tables/EmployeeTable";
import { AsyncCaseTable } from "./components/tables/CaseTable";
import { AsyncEventTable } from "./components/tables/EventTable";
import getAuthUser from "./auth/getUser";

import { App } from "./App";

// TODO AJO error states when network requests fail
import { 
  getTenants,
  getEmployees,
  getEmployee,
  getEmployeeCases,
  getEmployeeCaseValues,
  getEmployeeByIdentifier,
  getCompanyCases,
  getCompanyCaseValues,
  tenantDataCache,
  getDocumentCaseFields,
  getTasks,
  getTask,
  updateTask
} from "./api/FetchClient";
import EmployeeView from "./scenes/employees/EmployeeView";
import { ErrorView } from "./components/ErrorView";
import { AsyncCaseDisplay } from "./scenes/global/CaseDisplay";
import { AsyncTaskTable } from "./components/tables/TaskTable";
import { AsyncDocumentTable } from "./components/tables/DocumentTable";
import { DocumentDialog } from "./components/DocumentDialog";
import { AsyncTaskView } from "./components/TaskView";

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
    loader: () => { return { user: null }; },
    ErrorBoundary: ErrorView,
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
    ErrorBoundary: ErrorView,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "hr/employees",
        Component: AsyncEmployeeTable,
        loader: ({params}) =>  {
          return defer({
            data: getEmployees(params)
          });
        }
      },
      {
        path: "hr/employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="employee"/>,
        loader: async ({params}) => {
          const employee = await getEmployee(params);
          return { employee };
        },
        shouldRevalidate: ({currentParams, nextParams}) => currentParams.payrollId !== nextParams.payrollId || currentParams.employeeId !== nextParams.employeeId,
        id: "employee",
        ErrorBoundary: ErrorView,
        children: [
          {
            path: "data",
            Component: AsyncCaseDisplay,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "EmployeeData")
              });
            }
          },
          {
            path: "new",
            Component: AsyncCaseTable,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "NotAvailable")
              });
            }
          },
          {
            path: "new/:caseName",
            lazy: () => import("./scenes/global/CaseForm")
          },
          {
            path: "events",
            Component: AsyncEventTable,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCaseValues(params, null, "created desc")
              });
            }
          },
          {
            path: "documents",
            Component: AsyncDocumentTable,
            loader: ({params}) =>  {
              return defer({
                data: getDocumentCaseFields(params)
              });
            },
            children: [
              {
                path: ":caseValueId/i/:documentId",
                Component: DocumentDialog
              }
            ]
          }
        ]
      },
      {
        path: "company",
        children: [
          {
            path: "data",
            Component: AsyncCaseDisplay,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCases(params, "CompanyData")
              });
            }
          },
          {
            path: "new",
            Component: AsyncCaseTable,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCases(params, "NotAvailable")
              });
            }
          },
          {
            path: "new/:caseName",
            lazy: () => import("./scenes/global/CaseForm")
          },
          {
            path: "events",
            Component: AsyncEventTable,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCaseValues(params, null, "created desc")
              });
            }
          },
          {
            path: "documents",
            Component: AsyncDocumentTable,
            loader: ({params}) =>  {
              return defer({
                data: getDocumentCaseFields(params)
              });
            },
            children: [
              {
                path: ":caseValueId/i/:documentId",
                Component: DocumentDialog
              }
            ]
          },
          {
            path: "tasks",
            Component: AsyncTaskTable,
            loader: ({params}) =>  {
              return defer({
                data: getTasks(params, null, "created desc")
              });
            }
          },
          {
            path: "tasks/:taskId",
            Component: AsyncTaskView,
            loader: ({params}) => {
              return defer({
                data: getTask(params)
              });
            },
            action: async ({params, request}) => {
              const data = await request.json();
              console.log(data);
              return await updateTask(params, data);
            }
          }
        ]
      },
      {
        path: "employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="root" />,
        children: [
          {
            path: "data",
            Component: AsyncCaseDisplay,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "EmployeeData")
              });
            }
          },
          {
            path: "new",
            Component: AsyncCaseTable,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "ESS")
              });
            }
          },
          {
            path: "new/:caseName",
            lazy: () => import("./scenes/global/CaseForm")
          },
          {
            path: "tasks",
            Component: AsyncCaseTable,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "ECT")
              });
            }
          },
          {
            path: "tasks/:caseName",
            lazy: () => import("./scenes/global/CaseForm")
          },
          {
            path: "documents",
            Component: AsyncDocumentTable,
            loader: ({params}) =>  {
              return defer({
                data: getDocumentCaseFields(params)
              });
            },
            children: [
              {
                path: ":caseValueId/i/:documentId",
                Component: DocumentDialog
              }
            ]
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