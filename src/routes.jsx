
import * as React from "react";

import { createBrowserRouter, defer, matchRoutes, Navigate, redirect } from "react-router-dom";

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
import { getDefaultStore } from "jotai";
import { openTasksAtom, payrollsAtom, tenantAtom, userAtom } from "./utils/dataAtoms";
import { paramsAtom } from "./utils/routeParamAtoms";

const store = getDefaultStore();

async function getTenantData() {
  const [tenant, payrolls, user] = await Promise.all([
    store.get(tenantAtom),
    store.get(payrollsAtom),
    store.get(userAtom)
  ]);
  console.log(tenant, payrolls, user);
  return { tenant, payrolls, user };
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
    loader: async ({ params }) => {
      console.log("payroll loader");
      const { tenant, payrolls, user } = await getTenantData();
      if (!params.payrollId) {
        return redirect(payrolls[0].id + "");
      }
      const payroll = payrolls.find(p => p.id === Number(params.payrollId));
      const authUserEmail = getAuthUser()?.profile.email;
      const employee = await getEmployeeByIdentifier(params, authUserEmail);
      return { tenant, user, payrolls, payroll, employee };
    },
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
        path: "hr/tasks",
        Component: AsyncTaskTable,
        loader: async ({params, request }) => {
          const { user } = await getTenantData();
          const [_, queryString] = request.url.split("?");
          const searchParams = new URLSearchParams(queryString);
          let dataPromise = null;
          if (searchParams.has("completed")) {
            const filter = "completed ne null";
            const orderBy = `assignedUserId eq ${user.id}, completed, scheduled, created`;
            dataPromise = getTasks(params, filter, orderBy);
          } else {
            store.set(openTasksAtom);
            dataPromise = store.get(openTasksAtom);
          }
          return defer({
            data: dataPromise
          });
        }
      },
      {
        path: "hr/tasks/:taskId",
        Component: AsyncTaskView,
        loader: ({params}) => {
          return defer({
            data: getTask(params)
          });
        },
        action: async ({params, request}) => {
          const data = await request.json();
          const response = await updateTask(params, data);
          if (response.ok) {
            return redirect("../hr/tasks");
          }
          return response;
        }
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

const updateParamsAtom = (state) => {
  let matches = [];
  if (state.navigation.state === "loading") {
    // navigating away, parse new route
    matches = matchRoutes(routeData, state.navigation.location) || [];
  } else if (Array.isArray(state.matches)) {
    matches = [...state.matches];
  }
  const match = matches.pop();
  store.set(paramsAtom, match?.params ?? {});
};

updateParamsAtom({navigation: {state: 'loading', location: window.location}});

const browserRouter = createBrowserRouter(routeData,
{
  future: {
    v7_normalizeFormMethod: true
  }
});

browserRouter.subscribe(updateParamsAtom);

export { routeData, browserRouter };