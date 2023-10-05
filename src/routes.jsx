
import * as React from "react";

import { createBrowserRouter, defer, Navigate, redirect } from "react-router-dom";

import Tenants from "./scenes/tenants";
import Dashboard from "./scenes/dashboard";
import { EmployeeTableRoute } from "./components/tables/EmployeeTable";
import { CaseTable } from "./components/tables/CaseTable";
import { AsyncDataRoute } from "./routes/AsyncDataRoute";
import { EventTable } from "./components/tables/EventTable";
import { DocumentDialog, DocumentTable } from "./components/tables/DocumentTable";
import { CaseForm } from "./scenes/global/CasesForm";
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
import { ErrorView } from "./components/ErrorView";

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
        element: <Dashboard />,
      },
      {
        path: "hr/employees",
        element: <EmployeeTableRoute />,
        loader: ({params, request}) =>  {
          console.log(request);
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
        shouldRevalidate: ({currentParams, nextParams}) => currentParams.tenantId !== nextParams.tenantId || currentParams.employeeId !== nextParams.employeeId,
        id: "employee",
        ErrorBoundary: ErrorView,
        children: [
          {
            index: true,
            element: <AsyncDataRoute><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "EmployeeData")
              });
            }
          },
          {
            path: ":caseName",
            element: <CaseForm displayOnly />
          },
          {
            path: "new",
            element: <AsyncDataRoute><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "NotAvailable")
              });
            }
          },
          {
            path: "new/:caseName",
            Component: CaseForm,
          },
          {
            path: "events",
            element: <AsyncDataRoute fullWidthContent><EventTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCaseValues(params, null, "created desc")
              });
            }
          },
          {
            path: "documents",
            element: <AsyncDataRoute><DocumentTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCaseValues(params, "DocumentCount gt 0", "created desc")
              });
            }
          }
        ]
      },
      {
        path: "company",
        children: [
          {
            index: true,
            element: <AsyncDataRoute defaultTitle="Company data" ><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCases(params, "CompanyData")
              });
            }
          },
          {
            path: ":caseName",
            element: <CaseForm displayOnly defaultTitle="Company data"/>
          },
          {
            path: "new",
            element: <AsyncDataRoute defaultTitle="New Company event"><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCases(params, "NotAvailable")
              });
            }
          },
          {
            path: "new/:caseName",
            element: <CaseForm defaultTitle="New Company event" />
          },
          {
            path: "events",
            element: <AsyncDataRoute defaultTitle="Company events" disableXsPadding><EventTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCaseValues(params, null, "created desc")
              });
            }
          },
          {
            path: "documents",
            element: <AsyncDataRoute defaultTitle="Company documents"><DocumentTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getCompanyCaseValues(params, "DocumentCount gt 0", "created desc")
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
        path: "employees/:employeeId",
        element: <EmployeeView routeLoaderDataName="root" />,
        children: [
          {
            index: true,
            element: <AsyncDataRoute><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "EmployeeData")
              });
            }
          },
          {
            path: ":caseName",
            element: <CaseForm displayOnly />
          },
          {
            path: "new",
            element: <AsyncDataRoute><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "ESS")
              });
            }
          },
          {
            path: "new/:caseName",
            Component: CaseForm
          },
          {
            path: "tasks",
            element: <AsyncDataRoute><CaseTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCases(params, "ECT")
              });
            }
          },
          {
            path: "tasks/:caseName",
            Component: CaseForm,
          },
          {
            path: "documents",
            element: <AsyncDataRoute><DocumentTable /></AsyncDataRoute>,
            loader: ({params}) =>  {
              return defer({
                data: getEmployeeCaseValues(params, "DocumentCount gt 0", "created desc")
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