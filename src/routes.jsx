import * as React from "react";

import {
	createBrowserRouter,
	defer,
	matchRoutes,
	Navigate,
	redirect,
} from "react-router-dom";

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
	getDivision,
	addTask,
	getDocumentsOfCaseField,
	deleteDocument,
} from "./api/FetchClient";
import EmployeeView, { EmployeeTitle } from "./scenes/employees/EmployeeView";
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

const store = getDefaultStore();

async function getTenantData() {
	const [tenant, payrolls, user] = await Promise.all([
		store.get(tenantAtom),
		store.get(payrollsAtom),
		store.get(userAtom),
	]);
	return { tenant, payrolls, user };
}

function paginatedLoader({
	pageCount,
	name,
	getRequestBuilder,
	getLoaderData,
}) {
	return async (loaderParams) => {
		let page = new URL(loaderParams.request.url).searchParams.get("page") || 1;
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

const documentRoutes = [
	{
		path: "documents",
		Component: withPage("Documents", AsyncDocumentTable),
		loader: ({ params }) => {
			return defer({
				data: getDocumentCaseFields(params),
			});
		},
		children: [
			{
				path: ":caseFieldName",
				loader: ({ params, request }) => {
					const searchParams = new URL(request.url).searchParams;
					return getDocumentsOfCaseField(params, params.caseFieldName, searchParams.get("top"));
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
	}
]

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
				element: <Tenants />,
				loader: async () => {
					await getTenantData(); // reset cache
					return getTenants();
				},
			},
		],
	},
	{
		path: "tenants/:tenantId/payrolls/:payrollId?",
		element: <App renderDrawer />,
		loader: async ({ params }) => {
			const { tenant, payrolls, user } = await getTenantData();
			if (!params.payrollId) {
				return redirect(payrolls[0].id + "");
			}
			const payroll = payrolls.find((p) => p.id === Number(params.payrollId));
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
			{
				path: "hr/employees",
				Component: AsyncEmployeeTable,
				loader: ({ params, request }) => {
					const [_, queryString] = request.url.split("?");
					const searchParams = new URLSearchParams(queryString);
					const searchTerm = searchParams.get("search");
					const showAll = !!searchParams.get("showAll");
					let filter;
					if (searchTerm) {
						filter = `startswith_ci(firstName, '${searchTerm}') or startswith_ci(lastName, '${searchTerm}') or startswith_ci(identifier, '${searchTerm}')`;
					}
					return defer({
						data: getEmployees(params)
							.withQueryParam("filter", filter)
							.withQueryParam("status", showAll ? null : "Active")
							.fetchJson(),
					});
				},
			},
			{
				path: "hr/employees/new",
				Component: EmployeeForm,
				action: async ({ params, request }) => {
					const payroll = await store.get(payrollAtom);
					if (!payroll) return null;
					const division = await getDivision(params, payroll.divisionId);
					const formData = await request.formData();
					const response = await createEmployee(params, {
						identifier: formData.get("identifier"),
						firstName: formData.get("firstName"),
						lastName: formData.get("lastName"),
						divisions: [division.name],
					});

					if (response.status === 201) {
						const employee = await response.json();
						toast("success", "New employee created");
						return redirect(`../hr/employees/${employee.id}/missingdata`);
					}
					let errorMessage = await response.json();
					if (!errorMessage || typeof errorMessage !== "string") {
						errorMessage = "Saving failed!";
					}
					toast("error", errorMessage);
					return response;
				},
			},
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

					{
						path: "new/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
						loader: () => ({
							renderTitle: false,
						}),
					},
					{
						path: "events",
						Component: AsyncEventTable,
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ params }) =>
								getEmployeeCaseChanges(params, null, "created desc, id"),
						}),
					},
					...documentRoutes,
					{
						path: "missingdata/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
						loader: () => ({
							renderTitle: false,
						}),
					},
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
				path: "hr/employees/:employeeId/edit",
				Component: EmployeeForm,
				loader: async ({ params }) => getEmployee(params),
				action: async ({ params, request }) => {
					const formData = await request.formData();
					const response = await updateEmployee(params, {
						identifier: formData.get("identifier"),
						status: formData.get("status"),
						firstName: formData.get("firstName"),
						lastName: formData.get("lastName"),
						divisions: JSON.parse(formData.get("divisions")),
					});

					if (response.ok) {
						toast("success", "Saved!");
						return redirect(`../hr/employees/${params.employeeId}`);
					} else {
						let errorMessage = await response.json();
						if (!errorMessage || typeof errorMessage !== "string") {
							errorMessage = "Saving failed!";
						}
						toast("error", errorMessage);
					}
					return response;
				},
			},
			{
				path: "hr/tasks",
				Component: AsyncTaskTable,
				loader: async ({ params, request }) => {
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
				path: "hr/missingdata",
				Component: MissingDataView,
				loader: () => {
					store.set(openMissingDataTasksAtom);

					return defer({
						data: store.get(openMissingDataTasksAtom),
						title: "Missing data",
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
				path: "hr/missingdata/:employeeId",
				Component: EmployeeTitle,
				loader: ({ params }) => getEmployee(params),
				children: [
					{
						path: ":caseName",
						lazy: () => import("./scenes/global/CaseForm"),
						loader: () => ({
							redirect: "../..",
							renderTitle: false,
						}),
					},
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
				children: [
					{
						path: "missingdata",
						Component: withPage("Missing data", AsyncCaseTable),
						loader: ({ params }) => {
							return defer({
								data: getCompanyCases(params, "CCT"),
							});
						},
					},
					{
						path: "missingdata/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
					},
					{
						path: "new",
						Component: withPage("New event", AsyncCaseTable),
						loader: ({ params }) => {
							return defer({
								data: getCompanyCases(params, "NewEvent"),
							});
						},
					},
					{
						path: "new/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
					},
					{
						path: "events",
						Component: withPage("Events", AsyncEventTable),
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ params }) =>
								getCompanyCaseChanges(params, null, "created desc, id"),
						}),
					},
					...documentRoutes
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
					{
						path: "new/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
					},
					{
						path: "tasks",
						Component: withPage("Tasks", AsyncCaseTable),
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "ECT"),
							});
						},
					},
					{
						path: "tasks/:caseName",
						lazy: () => import("./scenes/global/CaseForm"),
					},
					...documentRoutes
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
