
import * as React from "react";

import { createBrowserRouter, defer, matchRoutes, Navigate, redirect } from "react-router-dom";

import Tenants from "./scenes/tenants";
import Dashboard from "./scenes/dashboard";
import { AsyncEmployeeTable } from "./components/tables/EmployeeTable";
import { AsyncCaseTable } from "./components/tables/CaseTable";
import { AsyncEventTable } from "./components/tables/EventTable";
import dayjs from "dayjs";

import { App } from "./App";

// TODO AJO error states when network requests fail
import { 
  getTenants,
  getEmployees,
  getEmployee,
  getEmployeeCases,
  getEmployeeCaseValues,
  getCompanyCases,
  getCompanyCaseValues,
  getDocumentCaseFields,
  getTasks,
  getTask,
  updateTask,
  getCompliance,
  getComplianceDocuments,
  getComplianceDocument,
  uploadComplianceDocument,
  createSubmission,
  getSubmissions,
  getSubmission,
  getSubmissionMessages,
  getDocument,
  getComplianceSettings,
  setComplianceSettings
} from "./api/FetchClient";
import EmployeeView from "./scenes/employees/EmployeeView";
import { ErrorView } from "./components/ErrorView";
import { AsyncCaseDisplay } from "./scenes/global/CaseDisplay";
import { AsyncTaskTable } from "./components/tables/TaskTable";
import { AsyncDocumentTable } from "./components/tables/DocumentTable";
import { CaseValueDocumentDialog } from "./components/DocumentDialog";
import { AsyncTaskView } from "./components/TaskView";
import { getDefaultStore } from "jotai";
import { openTasksAtom, payrollsAtom, showTaskCompletedAlertAtom, tenantAtom, userAtom, employeeAtom } from "./utils/dataAtoms";
import { paramsAtom } from "./utils/routeParamAtoms";
import { ComplianceView } from "./components/compliance/ComplianceView";
import { AsyncComplianceSettingsView } from "./components/compliance/ComplianceSettingsView";
import { CreateComplianceDocumentView } from "./components/compliance/CreateComplianceDocumentView";
import { AsyncComplianceDocumentView } from "./components/compliance/ComplianceDocumentView";
import { AsyncComplianceSubmissionView } from "./components/compliance/ComplianceSubmissionView";

const store = getDefaultStore();

async function getTenantData() {
  const [tenant, payrolls, user] = await Promise.all([
    store.get(tenantAtom),
    store.get(payrollsAtom),
    store.get(userAtom)
  ]);
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
        loader: async () => {
          await getTenantData(); // reset cache
          return getTenants();
        }
      }
    ]
  },
  {
    path: "tenants/:tenantId/payrolls/:payrollId?",
    element: <App renderDrawer />,
    loader: async ({ params }) => {
      const { tenant, payrolls, user } = await getTenantData();
      if (!params.payrollId) {
        return redirect(payrolls[0].id + "");
      }
      const payroll = payrolls.find(p => p.id === Number(params.payrollId));
      const employee = await store.get(employeeAtom);
      return { tenant, user, payrolls, payroll, employee };
    },
    shouldRevalidate: ({currentParams, nextParams}) => currentParams.tenantId !== nextParams.tenantId || currentParams.payrollId !== nextParams.payrollId,
    id: "root",
    ErrorBoundary: ErrorView,
    children: [
      {
        index: true,
        Component: Dashboard,
        loader: async () => {
          const { user } = await getTenantData();
          const isHrUser = user?.attributes.roles?.includes("hr");
          if (isHrUser) {
            return redirect("hr/tasks");
          }
          const employee = await store.get(employeeAtom);
          if (employee !== null) {
            return redirect(`employees/${employee.id}/new`);
          }
          return null;
        }
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
                Component: CaseValueDocumentDialog,
                loader: ({params}) => {
                  return defer({
                    document: getDocument(params)
                  });
                }
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
          const user = await store.get(userAtom);
          let task = data.task;
          switch(data.action) {
            case "accept":
              task = {...task, assignedUserId: user.id};
              break;
            case "complete":
              task = {...task, comment: data.comment, completedUserId: user.id, completed: dayjs.utc().toISOString()};
              break;
            case "saveComment":
              task = {...task, comment: data.comment};
              break;
            default:
              throw new Error("no action specified");
          }
          const response = await updateTask(params, task);
          if (response.ok && data.action === "complete") {
            store.set(showTaskCompletedAlertAtom, true);
            return redirect("../hr/tasks");
          }
          return response;
        }
      },
      {
        path: "hr/compliance",
        Component: ComplianceView,
        loader: ({params}) => {
          return defer({
            documents: getComplianceDocuments(params),
            submissions: getSubmissions(params)
          });
        }
      },
      {
        path: "hr/compliance/settings",
        Component: AsyncComplianceSettingsView,
        loader: ({params}) => {
          return defer({
            data: getComplianceSettings(params)
          });
        },
        action: async ({request, params}) => {
          const settings = await request.json();
          return setComplianceSettings(params, settings);
        }
      },
      {
        path: "hr/compliance/documents",
        loader: ({params}) => {
          return getComplianceDocuments(params);
        }
      },
      {
        path: "hr/compliance/documents/:documentId",
        Component: AsyncComplianceDocumentView,
        loader: ({params}) => {
          return defer({
            data: getComplianceDocument(params)
          });
        },
        action: async ({request, params}) => {
          const { isTestCase } = await request.json();
          const submission = await createSubmission(params, isTestCase);
          return redirect(`../hr/compliance/submissions/${submission.id}`);
        }
      },
      {
        path: "hr/compliance/documents/new",
        Component: CreateComplianceDocumentView,
        action: async ({params, request}) => {
          const data = await request.json();
          const response = await uploadComplianceDocument(params, data);
          return redirect(`../hr/compliance/documents/${response.id}`)
        }
      },
      {
        path: "hr/compliance/submissions",
        loader: ({params}) => {
          return getSubmissions(params);
        }
      },
      {
        path: "hr/compliance/submissions/:submissionId",
        Component: AsyncComplianceSubmissionView,
        loader: ({params}) => {
          return defer({
            submission: getSubmission(params),
            messages: getSubmissionMessages(params)
          });
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
                Component: CaseValueDocumentDialog,
                loader: ({params}) => {
                  return defer({
                    document: getDocument(params)
                  });
                }
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
                title: "Tasks",
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
                Component: CaseValueDocumentDialog,
                loader: ({params}) => {
                  return defer({
                    document: getDocument(params)
                  });
                }
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