import * as React from "react";

import {
	createBrowserRouter,
	defer,
	matchRoutes,
	Navigate,
	redirect,
} from "react-router-dom";

import { TenantList } from "./scenes/tenants";
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
	getEmployeeCaseChanges,
	getCompanyCases,
	getCompanyCaseChanges,
	getDocumentCaseFields,
	getPayrunJobs,
	getDraftPayrunJobs,
	getTasks,
	getTask,
	updateTask,
	startPayrunJob,
	changePayrunJobStatus,
	getComplianceDocuments,
	getComplianceDocument,
	uploadComplianceDocument,
	createSubmission,
	getSubmissions,
	getSubmission,
	getComplianceMessages,
	getDocument,
	getComplianceSettings,
	setComplianceSettings,
	getComplianceCertificates,
	generateComplianceDocument,
	getReports,
	createEmployee,
	updateEmployee,
	addTask,
	getDocumentsOfCaseField,
	deleteDocument,
	importTenant,
	requestExportDataDownload,
	deleteTenant,
	getDivisions,
	getCaseValues
} from "./api/FetchClient";
import { EmployeeView, EmployeeTitle } from "./scenes/employees/EmployeeView";
import { ErrorView } from "./components/ErrorView";
import { AsyncTaskTable } from "./components/tables/TaskTable";
import { AsyncDocumentTable } from "./components/tables/DocumentTable";
import { CaseValueDocumentDialog } from "./components/DocumentDialog";
import { AsyncTaskView } from "./components/TaskView";
import { getDefaultStore } from "jotai";
import {
	openTasksAtom,
	payrollsAtom,
	tenantAtom,
	userAtom,
	employeeAtom,
	payrunAtom,
	toast,
	payrollAtom,
	openMissingDataTasksAtom,
	tenantsAtom
} from "./utils/dataAtoms";
import { paramsAtom } from "./utils/routeParamAtoms";
import { AsyncPayrunView } from "./components/payrun/PayrunView";
import { AsyncNewPayrunView } from "./components/payrun/NewPayrunView";
import { ComplianceView } from "./components/compliance/ComplianceView";
import { AsyncComplianceSettingsView } from "./components/compliance/ComplianceSettingsView";
import { CreateComplianceDocumentView } from "./components/compliance/CreateComplianceDocumentView";
import { AsyncComplianceDocumentView } from "./components/compliance/ComplianceDocumentView";
import { AsyncComplianceSubmissionView } from "./components/compliance/ComplianceSubmissionView";
import { AsyncReportsView } from "./components/ReportsView";
import { AsyncReportView } from "./components/ReportView";
import { CompletionView } from "./components/compliance/CompletionView";
import { MissingDataView } from "./components/MissingDataView";
import { EmployeeForm } from "./components/EmployeeForm";
import { withPage } from "./components/ContentLayout";
import { NewTaskView } from "./components/NewTaskView";
import { TenantImport } from "./scenes/tenants/TenantImport";
import { TenantSettings } from "./scenes/tenants/TenantSettings";
import { CompanyView } from "./scenes/CompanyView";

const store = getDefaultStore();

async function getTenantData() {
	const [tenant, payrolls, user] = await Promise.all([
		store.get(tenantAtom),
		store.get(payrollsAtom),
		store.get(userAtom),
	]);
	return { tenant, payrolls, user };
}

function getQueryParam(request, name, defaultValue = null) {
	return new URL(request.url).searchParams.get(name) || defaultValue;
}

function paginatedLoader({
	pageCount,
	name,
	getRequestBuilder,
	getLoaderData,
}) {
	return async (loaderParams) => {
		let page = getQueryParam(loaderParams.request, "page", 1);
		page = Number(page) - 1;
		const loaderData = getLoaderData
			? await Promise.resolve(getLoaderData(loaderParams))
			: {};
		const requestBuilder = await Promise.resolve(
			getRequestBuilder(loaderParams),
		);
		const result = {
			...loaderData,
			pageCount,
			[name ?? "data"]: requestBuilder
				.withPagination(page, pageCount)
				.fetchJson(),
		};
		return defer(result);
	};
}

function createRouteCaseForm(path, data) {
	const loader = data ? () => data : undefined;
	return {
		path,
		loader,
		lazy: () => import("./scenes/global/CaseForm"),
		children: [
			{
				path: "history/:caseFieldName",
				loader: ({ request, params }) => {
					const top = getQueryParam(request, "top");
					return getCaseValues(params, top);
				}
			}
		]
	};
}

function createRouteDocument(showTitle) {
	const Component = showTitle ? withPage("Documents", AsyncDocumentTable) : AsyncDocumentTable;
	return {
		Component,
		path: "documents",
		loader: ({ params }) => {
			return defer({
				data: getDocumentCaseFields(params),
			});
		},
		children: [
			{
				path: ":caseFieldName",
				loader: ({ params, request }) => {
					const top = getQueryParam(request, "top");
					return getDocumentsOfCaseField(params, params.caseFieldName, top);
				}
			},
			{
				path: ":caseValueId/i/:documentId",
				Component: CaseValueDocumentDialog,
				action: async ({ params }) => {
					const response = await deleteDocument(params);
					if (response.ok) {
						toast("success", "Document deleted")
					} else {
						toast("error", "Could not delete document");
					}
					return redirect("..");
				},
				loader: ({ params }) => {
					return defer({
						document: getDocument(params),
					});
				},
			},
		]
	};
}

function createRouteEmployeeTable(path, showButtons = true) {
	return {
		path,
		Component: AsyncEmployeeTable,
		loader: async ({ request, params }) => {
			const searchParams = new URL(request.url).searchParams;
			const searchTerm = searchParams.get("search");
			const showAll = !!searchParams.get("showAll");
			let filter;
			if (searchTerm) {
				filter = `contains_ci(firstName, '${searchTerm}') or contains_ci(lastName, '${searchTerm}') or contains_ci(identifier, '${searchTerm}')`;
			}
			return defer({
				showButtons,
				data: getEmployees(params)
					.withQueryParam("filter", filter)
					.withQueryParam("status", showAll ? null : "Active")
					.fetchJson(),
			});
		}
	};
}

function createRouteEmployeeEdit(path, createUrlRedirect) {
	return {
		path,
		Component: EmployeeForm,
		loader: async ({ params }) => {
			const employee = await getEmployee(params);
			const divisions = await getDivisions(params);
			return { employee, divisions, selectedDivisions: employee.divisions };
		},
		action: async ({ params, request }) => {
			const formData = await request.formData();
			const response = await updateEmployee(params, {
				identifier: formData.get("identifier"),
				status: formData.get("status"),
				firstName: formData.get("firstName"),
				lastName: formData.get("lastName"),
				divisions: formData.getAll("divisions"),
			});

			if (response.ok) {
				toast("success", "Saved!");
				const urlRedirect = createUrlRedirect(params.employeeId);
				return redirect(urlRedirect);
			} else {
				let errorMessage = await response.json();
				if (!errorMessage || typeof errorMessage !== "string") {
					errorMessage = "Saving failed!";
				}
				toast("error", errorMessage);
			}
			return response;
		},
	};
}

function createRouteEmployeeNew(path, createUrlRedirect) {
	return {
		path,
		Component: EmployeeForm,
		loader: async ({ params }) => {
			const divisions = await getDivisions(params);
			const payroll = await store.get(payrollAtom);
			const selectedDivisions = !!payroll ? [divisions.find(d => d.id === payroll.divisionId).name] : [];
			return { divisions, selectedDivisions };
		},
		action: async ({ params, request }) => {
			const formData = await request.formData();
			const response = await createEmployee(params, {
				identifier: formData.get("identifier"),
				firstName: formData.get("firstName"),
				lastName: formData.get("lastName"),
				divisions: formData.getAll("divisions")
			});

			if (response.status === 201) {
				const employee = await response.json();
				toast("success", "New employee created");
				const urlRedirect = createUrlRedirect(employee.id);
				return redirect(urlRedirect);
			}
			let errorMessage = await response.json();
			if (!errorMessage || typeof errorMessage !== "string") {
				errorMessage = "Saving failed!";
			}
			toast("error", errorMessage);
			return response;
		},
	};
}

const routeData = [
	{
		path: "/",
		element: <App />,
		loader: () => {
			return { user: null };
		},
		ErrorBoundary: ErrorView,
		children: [
			{
				index: true,
				element: <Navigate to="tenants" replace />,
			},
			{
				path: "tenants",
				Component: TenantList,
				loader: async () => {
					store.set(tenantsAtom); // refresh
					const tenants = await store.get(tenantsAtom);
					if (tenants.length === 1) {
						return redirect(`../tenants/${tenants[0].id}`);
					}
					return tenants;
				}
			},
			{
				path: "tenants/import",
				Component: TenantImport,
				action: async ({ request }) => {
					const formData = await request.formData();
					const response = await importTenant(formData);
					if (response.ok) {
						const body = await response.json();
						toast("success", "Tenant imported");
						return redirect(`../tenants/${body}/payrolls`);
					}
					else if (response.status === 500) {
						const body = await response.json();
						const error = JSON.parse(body);
						toast("error", error.Message);
					} else {
						toast("error", "Import was not successful");
					}
					return null;
				}
			}
		],
	},
	{
		path: "tenants/:tenantId",
		element: <App renderDrawer />,
		ErrorBoundary: ErrorView,
		loader: async () => {
			const { tenant, payrolls, user } = await getTenantData();
			const employee = await store.get(employeeAtom);
			return { tenant, user, payrolls, employee };
		},
		id: "tenantRoot",
		children: [
			{
				index: true,
				loader: async () => {
					const { user } = await getTenantData();
					const isAdmin = user?.attributes.roles?.includes("admin");
					if (isAdmin)
						return redirect("employees");
					return redirect("payrolls");

				}
			},
			createRouteEmployeeTable("employees", false),
			createRouteEmployeeNew("employees/new", () => "../employees"),
			createRouteEmployeeEdit("employees/:employeeId", () => "../employees"),
			{
				path: "settings",
				Component: TenantSettings,
				action: async ({ params, request }) => {
					var formData = await request.formData();
					switch (formData.get("intent")) {
						case "export":
							try {
								const { tenant } = await getTenantData();
								const name = `${tenant.identifier}_export.zip`;
								await requestExportDataDownload({ tenantId: params.tenantId }, name);
								toast("success", "Exported tenant");
							}
							catch {
								toast("error", "Tenant could not be exported");
							}
							return null;
						case "delete":
							try {
								var response = await deleteTenant(params);
								if (response.ok) {
									toast("success", "Tenant deleted");
									return redirect("/tenants");
								}
							}
							catch {
								toast("error", "Tenant could not be deleted");
							}
							return null;
						default:
							throw new Error("Invalid intent");
					}
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
				return redirect(payrolls[0].id);
			}
			const payroll = payrolls.find((p) => p.id === params.payrollId);
			const employee = await store.get(employeeAtom);
			return { tenant, user, payrolls, payroll, employee };
		},
		shouldRevalidate: ({ currentParams, nextParams }) =>
			currentParams.tenantId !== nextParams.tenantId ||
			currentParams.payrollId !== nextParams.payrollId,
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
				},
			},
			createRouteEmployeeTable("hr/employees"),
			createRouteEmployeeNew("hr/employees/new", employeeId => `../hr/employees/${employeeId}/missingdata`),
			createRouteEmployeeEdit("hr/employees/:employeeId/edit", employeeId => `../hr/employees/${employeeId}`),
			{
				path: "hr/employees/:employeeId",
				element: <EmployeeView />,
				loader: async ({ params }) => {
					const employee = await getEmployee(params);
					return { employee };
				},
				id: "employee",
				ErrorBoundary: ErrorView,
				children: [
					{
						path: "new",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "NewEvent"),
							});
						},
					},
					createRouteCaseForm("new/:caseName", {
						renderTitle: false,
					}),
					{
						path: "events",
						Component: AsyncEventTable,
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ request, params }) => {
								const search = getQueryParam(request, "q");
								return getEmployeeCaseChanges(params, search, "created desc, id");
							}
						}),
					},
					createRouteDocument(false),
					createRouteCaseForm("missingdata/:caseName", {
						renderTitle: false,
					}),
					{
						path: "missingdata",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "HRCT"),
								noDataAvailableText: "Data complete.",
							});
						},
					},
				],
			},
			{
				path: "hr/tasks",
				Component: AsyncTaskTable,
				loader: async ({ params, request }) => {
					const { user } = await getTenantData();
					const searchParams = new URL(request.url).searchParams;
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
						data: dataPromise,
					});
				},
			},
			{
				path: "hr/tasks/new",
				Component: NewTaskView,
				loader: ({ params }) => getEmployees(params).fetchJson(),
				action: async ({ params, request }) => {
					const task = await request.json();
					const response = await addTask(params, task);
					if (response.ok) {
						toast("success", "Task saved!");
						return redirect("../hr/tasks");
					}
					return response;
				},
			},
			{
				path: "hr/tasks/:taskId",
				Component: AsyncTaskView,
				loader: ({ params }) => {
					return defer({
						data: getTask(params),
					});
				},
				action: async ({ params, request }) => {
					const data = await request.json();
					const user = await store.get(userAtom);
					let task = data.task;
					switch (data.action) {
						case "accept":
							task = { ...task, assignedUserId: user.id };
							break;
						case "complete":
							task = {
								...task,
								comment: data.comment,
								completedUserId: user.id,
								completed: dayjs.utc().toISOString(),
							};
							break;
						case "saveComment":
							task = { ...task, comment: data.comment };
							break;
						default:
							throw new Error("no action specified");
					}
					const response = await updateTask(params, task);
					if (response.ok) {
						if (data.action === "complete") {
							toast("success", "Task completed!");
							return redirect("../hr/tasks");
						}
						if (data.action === "accept") {
							toast("success", "Task accepted");
						}
						if (data.action === "saveComment") {
							toast("success", "Comment saved");
						}
					}
					return response;
				},
			},
			{
				path: "hr/controlling",
				Component: MissingDataView,
				loader: () => {
					store.set(openMissingDataTasksAtom);

					return defer({
						data: store.get(openMissingDataTasksAtom),
						title: "Controlling",
					});
				},
				children: [
					{
						path: ":employeeId",
						loader: async ({ params }) => {
							const caseTasks = await getEmployeeCases(params, "HRCT");
							return Array.isArray(caseTasks) ? caseTasks : [];
						},
					},
				],
			},
			{
				path: "hr/controlling/:employeeId",
				Component: EmployeeTitle,
				loader: ({ params }) => getEmployee(params),
				children: [
					createRouteCaseForm(":caseName", {
						redirect: "../..",
						renderTitle: false,
					})
				],
			},
			{
				path: "hr/payruns",
				Component: AsyncPayrunView,
				loader: paginatedLoader({
					pageCount: 15,
					name: "payrunJobs",
					getRequestBuilder: async ({ params }) => {
						const payrun = await store.get(payrunAtom);
						return getPayrunJobs({ ...params, payrunId: payrun.id });
					},
					getLoaderData: ({ params }) => ({
						draftPayrunJobs: getDraftPayrunJobs(params),
					}),
				}),
				action: async ({ params, request }) => {
					const action = await request.json();
					const payrun = await store.get(payrunAtom);
					if (action.type === "change_status") {
						// TODO AJO what to do
						await changePayrunJobStatus(
							{ ...params, payrunId: payrun.id, payrunJobId: action.jobId },
							action.status,
						);
					}
					return null;
				},
				children: [
					{
						path: "new",
						Component: AsyncNewPayrunView,
						loader: async ({ params }) => {
							const payrun = await store.get(payrunAtom);
							return defer({
								payrun,
								data: getEmployees(params).withActive().fetchJson(),
							});
						},
						action: async ({ params, request }) => {
							const invocation = await request.json();
							const response = await startPayrunJob(params, invocation);
							if (response.status === 201) {
								const job = await response.json();
								if (job.jobStatus === "Abort") {
									return job.message;
								}
								return redirect(`..`);
							}
							if (response.status === 400) {
								try {
									const errorJson = await response.json();
									return errorJson.errors.Reason[0];
								} catch (e) { }
							}
							return null;
						},
					},
				],
			},
			,
			{
				path: "hr/compliance",
				Component: ComplianceView,
				loader: ({ params }) => {
					return defer({
						documents: getComplianceDocuments(params),
						submissions: getSubmissions(params),
						messages: getComplianceMessages(params),
					});
				},
			},
			{
				path: "hr/compliance/settings",
				Component: AsyncComplianceSettingsView,
				loader: ({ params }) => {
					return defer({
						data: getComplianceSettings(params),
					});
				},
				action: async ({ request, params }) => {
					const settings = await request.json();
					const response = await setComplianceSettings(params, settings);
					if (response.ok) {
						toast("success", "Settings saved!");
					} else {
						toast("error", "Error while saving settings!");
					}
					return response;
				},
				children: [
					{
						path: "transmittercertificates",
						loader: ({ params }) => {
							return getComplianceCertificates(params, "Transmitter");
						},
					},
					{
						path: "enterprisecertificates",
						loader: ({ params }) => {
							return getComplianceCertificates(params, "Enterprise");
						},
					},
				],
			},
			{
				path: "hr/compliance/documents",
				loader: ({ params }) => {
					return getComplianceDocuments(params);
				},
			},
			{
				path: "hr/compliance/documents/:documentId",
				Component: AsyncComplianceDocumentView,
				loader: ({ params }) => {
					return defer({
						data: getComplianceDocument(params),
						pdfPromise: getComplianceDocument(params, true),
					});
				},
				action: async ({ request, params }) => {
					const { isTestCase } = await request.json();
					const submission = await createSubmission(params, isTestCase);
					if (submission.errors) {
						toast("error", "Submission was unsuccessful!");
					} else {
						toast("success", "Submission was successful!");
					}
					return redirect(`../hr/compliance/submissions/${submission.id}`);
				},
			},
			{
				path: "hr/compliance/documents/new",
				Component: CreateComplianceDocumentView,
				action: async ({ params, request }) => {
					const data = await request.json();
					let response = null;
					switch (data.type) {
						case "upload":
							response = await uploadComplianceDocument(params, data.document);
							break;
						case "generate":
							response = await generateComplianceDocument(
								params,
								data.reportRequest,
							);
							break;
						default:
							throw new Error("invalid action");
					}
					if (response.ok) {
						toast("success", "Document ready!");
						const document = await response.json();
						return redirect(`../hr/compliance/documents/${document.id}`);
					} else {
						toast("error", "Unable to save document!");
						return null;
					}
				},
			},
			{
				path: "hr/compliance/submissions",
				loader: ({ params }) => {
					return getSubmissions(params);
				},
			},
			{
				path: "hr/compliance/submissions/:submissionId",
				Component: AsyncComplianceSubmissionView,
				loader: ({ params }) => {
					return defer({
						submission: getSubmission(params),
						messages: getComplianceMessages(params),
					});
				},
			},
			{
				path: "hr/compliance/submissions/:submissionId/tasks/:taskId",
				Component: CompletionView,
				loader: ({ params }) => {
					return defer({
						submission: getSubmission(params),
						messages: getComplianceMessages(params),
					});
				},
			},
			{
				path: "hr/reports",
				Component: AsyncReportsView,
				loader: ({ params }) => {
					return defer({
						data: getReports(params, "AvailableReports"),
					});
				},
			},
			{
				path: "hr/reports/:reportId",
				Component: AsyncReportView,
			},
			{
				path: "company",
				Component: CompanyView,
				children: [
					{
						path: "missingdata",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getCompanyCases(params, "CCT"),
							});
						},
					},
					createRouteCaseForm("missingdata/:caseName", {
						renderTitle: false,
					}),
					{
						path: "new",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getCompanyCases(params, "NewEvent"),
							});
						},
					},
					createRouteCaseForm("new/:caseName", {
						renderTitle: false,
					}),
					{
						path: "events",
						Component: AsyncEventTable,
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ params }) => {
								const search = getQueryParam(request, "q");
								return getCompanyCaseChanges(params, search, "created desc, id");
							},
						}),
					},
					createRouteDocument(false),
				],
			},
			{
				path: "employees/:employeeId",
				children: [
					{
						path: "new",
						Component: withPage("New event", AsyncCaseTable),
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "ESS"),
							});
						},
					},
					createRouteCaseForm("new/:caseName"),
					{
						path: "tasks",
						Component: withPage("Tasks", AsyncCaseTable),
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "ECT"),
							});
						},
					},
					createRouteCaseForm("tasks/:caseName"),
					createRouteDocument(true),
				],
			},
		],
	},
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

updateParamsAtom({
	navigation: { state: "loading", location: window.location },
});

const browserRouter = createBrowserRouter(routeData, {
	future: {
		v7_normalizeFormMethod: true,
	},
});

browserRouter.subscribe(updateParamsAtom);

export { routeData, browserRouter };
