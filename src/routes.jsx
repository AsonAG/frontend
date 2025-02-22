import * as React from "react";

import {
	createBrowserRouter,
	defer,
	matchRoutes,
	Navigate,
	redirect,
} from "react-router-dom";

import { OrganizationList } from "./organization/List";
import Dashboard from "./scenes/dashboard";
import { AsyncEmployeeTable } from "./components/tables/EmployeeTable";
import { AsyncCaseTable } from "./components/tables/CaseTable";
import { AsyncEventTable } from "./components/tables/EventTable";
import dayjs from "dayjs";

import { App } from "./App";

// TODO AJO error states when network requests fail
import {
	getEmployees,
	getEmployee,
	getEmployeeCases,
	getEmployeeCaseChanges,
	getCompanyCases,
	getCompanyCaseChanges,
	getTasks,
	getTask,
	updateTask,
	getDocument,
	getReports,
	createEmployee,
	updateEmployee,
	addTask,
	getDocumentsOfCaseField,
	deleteDocument,
	importOrganization,
	requestExportDataDownload,
	deleteOrganization,
	getDivisions,
	getCaseChangeCaseValues,
	getCurrentValues,
	getCaseValueCount,
	getClosedPayrunPeriods,
	getOpenPayrunPeriod,
	closePayrunPeriod,
	getPayrunPeriodDocument,
	getPayrunPeriod,
	getPayrunPeriodCaseValues,
	getPayouts,
	createPayout,
	cancelPayout,
	downloadData,
	bootstrapPayrunPeriods,
	getCompanyBankDetails as getCompanyBankAccountDetails,
	getPayrunPeriodControllingTasks,
	getEmployeeSalaryType,
	getPreviousPayrunPeriod
} from "./api/FetchClient";
import { EmployeeTabbedView } from "./employee/EmployeeTabbedView";
import { ErrorView } from "./components/ErrorView";
import { AsyncTaskTable } from "./components/tables/TaskTable";
import { DocumentTable } from "./components/tables/DocumentTable";
import { CaseValueDocumentDialog } from "./components/DocumentDialog";
import { AsyncTaskView } from "./components/TaskView";
import { getDefaultStore } from "jotai";
import {
	openTasksAtom,
	payrollsAtom,
	orgAtom,
	userAtom,
	selfServiceEmployeeAtom,
	toast,
	payrollAtom,
	orgsAtom,
	missingDataEmployeesAtom,
	ESSMissingDataAtom,
	missingEmployeeDataMapAtom,
	missingDataCompanyAtom,
	onboardingCompanyAtom
} from "./utils/dataAtoms";
import { paramsAtom } from "./utils/routeParamAtoms";
import { PayrunDashboard } from "./payrun/Dashboard";
import { AsyncReportsView } from "./components/ReportsView";
import { AsyncReportView } from "./components/ReportView";
import { MissingDataView } from "./components/MissingDataView";
import { EmployeeForm } from "./components/EmployeeForm";
import { ContentLayout, withPage, withSuspense } from "./components/ContentLayout";
import { NewTaskView } from "./components/NewTaskView";
import { OrganizationImport } from "./organization/Import";
import { OrganizationSettings } from "./organization/Settings";
import { getEmployeeDisplayString } from "./models/Employee";
import { DataValueHistory } from "./components/tables/DataTable";
import { DataView } from "./components/DataView";

import { PayrunPeriodList } from "./payrun/List";
import { ReviewOpenPeriod } from "./payrun/ReviewOpenPeriod";
import { getPayoutFileName, Payouts } from "./payrun/Payouts";
import { ClosedPeriodDocuments } from "./payrun/ClosedPeriodDocuments";
import { PeriodCaseValueDialog } from "./payrun/PeriodCaseValueDialog";
import { base64ToBytes } from "./services/converters/BinaryConverter";
import { CompanyTabbedView } from "./company/CompanyTabbedView";
import { OnboardingView } from "./company/OnboardingView";
import { PayrunErrorBoundary } from "./payrun/PayrunErrorBoundary";
const store = getDefaultStore();

async function getOrganizationData() {
	const [org, payrolls, user] = await Promise.all([
		store.get(orgAtom),
		store.get(payrollsAtom),
		store.get(userAtom),
	]);
	return { org, payrolls, user };
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
	let loader = undefined;
	if (data instanceof Function) {
		loader = data;
	} else if (!!data) {
		loader = () => data;
	}
	return {
		path,
		loader,
		lazy: () => import("./scenes/global/CaseForm"),
		children: [
			{
				path: "history/:caseFieldName",
				loader: ({ request, params }) => {
					const top = getQueryParam(request, "top");
					return getCaseChangeCaseValues(params, top);
				}
			}
		]
	};
}

function createRouteDocument(showTitle) {
	const Component = showTitle ? withPage("Documents", DocumentTable) : DocumentTable;
	const loader = async ({ params }) => {
		const documentCases = await (params.employeeId ? getEmployeeCases : getCompanyCases)(params, "DOC");
		if (documentCases) {
			documentCases.sort(((a, b) => a.attributes?.["tag.order"] - b.attributes?.["tag.order"]));
			const caseFieldNames = documentCases.flatMap(c => c.caseFields.map(cf => cf.name));
			const caseValues = await Promise.all(caseFieldNames.map(name => getDocumentsOfCaseField(params, name)));
			let values = {};
			for (let i = 0; i < caseFieldNames.length; i++) {
				values[caseFieldNames[i]] = caseValues[i];
			}

			return {
				values,
				data: documentCases
			}
		}
		return {
			data: documentCases,
			values: []
		};
	};
	return {
		Component,
		path: "documents",
		loader,
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

function createRouteDataView(path, getData) {
	return {
		path,
		Component: DataView,
		loader: async (props) => {
			const { params } = props;
			const dataCasesPromise = (params.employeeId ? getEmployeeCases(params, "ED") : getCompanyCases(params, "CD"));
			const [values, valueCounts, dataCases] = await Promise.all([getCurrentValues(params), getCaseValueCount(params, 2), dataCasesPromise]);
			const injectedData = await getData(props);
			return {
				...injectedData,
				values,
				valueCounts,
				dataCases
			};
		},
		children: [
			{
				path: ":caseFieldName",
				Component: DataValueHistory,
				loader: ({ params }) => {
					return getCaseChangeCaseValues(params);
				}
			}
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
			return null;
		},
	};
}

function createRoutePayrunPeriodDocument() {
	return {
		path: ":payrunPeriodId/doc/:documentId",
		Component: CaseValueDocumentDialog,
		loader: async ({ params, request }) => {
			const report = getQueryParam(request, "report")
			const variant = getQueryParam(request, "variant")
			return defer({
				document: getPayrunPeriodDocument(params, report, variant),
			});
		}
	}
}


function createRouteCaseForms(path) {
	return [
		{
			path: `${path}/employees/:employeeId`,
			Component: ContentLayout,
			loader: async ({ params }) => {
				const employee = await getEmployee(params);
				return {
					title: getEmployeeDisplayString(employee)
				};
			},
			children: [
				createRouteCaseForm("new/:caseName", {
					redirect: "../../../.."
				})
			],
		},
		{
			path: `${path}/company`,
			Component: ContentLayout,
			loader: () => ({
				title: "Company"
			}),
			children: [
				createRouteCaseForm("new/:caseName", {
					redirect: "../../.."
				})
			],
		},
	]
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
				element: <Navigate to="orgs" replace />,
			},
			{
				path: "orgs",
				Component: OrganizationList,
				loader: async () => {
					store.set(orgsAtom); // refresh
					const orgs = await store.get(orgsAtom);
					if (orgs.length === 1) {
						return redirect(`../orgs/${orgs[0].id}`);
					}
					return orgs;
				}
			},
			{
				path: "orgs/import",
				Component: OrganizationImport,
				action: async ({ request }) => {
					const formData = await request.formData();
					const response = await importOrganization(formData);
					if (response.ok) {
						const body = await response.json();
						toast("success", "Organization imported");
						return redirect(`../orgs/${body}/payrolls`);
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
			},
			{
				path: "orgs/bootstrap",
				action: async () => {
					await bootstrapPayrunPeriods();
					return redirect("..");
				}
			}
		],
	},
	{
		path: "orgs/:orgId",
		element: <App renderDrawer />,
		ErrorBoundary: ErrorView,
		loader: async () => {
			const { org, payrolls, user } = await getOrganizationData();
			const employee = await store.get(selfServiceEmployeeAtom);
			return { org, user, payrolls, employee };
		},
		id: "orgRoot",
		children: [
			{
				index: true,
				loader: async () => {
					// const { user } = await getOrganizationData();
					// const isAdmin = user?.attributes.roles?.includes("admin");
					// if (isAdmin)
					// 	return redirect("employees");
					return redirect("payrolls");

				}
			},
			createRouteEmployeeTable("employees", false),
			createRouteEmployeeNew("employees/new", () => "../employees"),
			createRouteEmployeeEdit("employees/:employeeId", () => "../employees"),
			{
				path: "settings",
				Component: OrganizationSettings,
				action: async ({ params, request }) => {
					var formData = await request.formData();
					switch (formData.get("intent")) {
						case "export":
							try {
								const { org } = await getOrganizationData();
								const name = `${org.identifier}_export.zip`;
								await requestExportDataDownload({ orgId: params.orgId }, name);
								toast("success", "Exported organization");
							}
							catch {
								toast("error", "Organization could not be exported");
							}
							return null;
						case "delete":
							try {
								var response = await deleteOrganization(params);
								if (response.ok) {
									toast("success", "Organization deleted");
									return redirect("/orgs");
								}
							}
							catch {
								toast("error", "Organization could not be deleted");
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
		path: "orgs/:orgId/payrolls/:payrollId?",
		element: <App renderDrawer />,
		loader: async ({ params }) => {
			const { org, payrolls, user } = await getOrganizationData();
			if (!params.payrollId) {
				return redirect(payrolls[0].id);
			}
			const payroll = payrolls.find((p) => p.id === params.payrollId);
			const employee = await store.get(selfServiceEmployeeAtom);
			return { org, user, payrolls, payroll, employee };
		},
		shouldRevalidate: ({ currentParams, nextParams }) =>
			currentParams.orgId !== nextParams.orgId ||
			currentParams.payrollId !== nextParams.payrollId,
		id: "root",
		ErrorBoundary: ErrorView,
		children: [
			{
				index: true,
				Component: Dashboard,
				loader: async () => {
					const { user } = await getOrganizationData();
					const isHrUser = user?.attributes.roles?.includes("hr");
					if (isHrUser) {
						return redirect("hr/employees");
					}
					const employee = await store.get(selfServiceEmployeeAtom);
					if (employee !== null) {
						return redirect(`employees/${employee.id}/documents`);
					}
					return null;
				},
			},
			createRouteEmployeeTable("hr/employees"),
			createRouteEmployeeNew("hr/employees/new", employeeId => `../hr/employees/${employeeId}/data`),
			createRouteEmployeeEdit("hr/employees/:employeeId/edit", employeeId => `../hr/employees/${employeeId}`),
			{
				path: "hr/employees/:employeeId",
				Component: EmployeeTabbedView,
				loader: async ({ params }) => {
					const employee = await getEmployee(params);
					store.set(missingDataEmployeesAtom);
					const map = await store.get(missingEmployeeDataMapAtom);
					return {
						pageTitle: getEmployeeDisplayString(employee),
						status: employee.status,
						missingData: map.get(employee.id)
					};
				},
				id: "employee",
				shouldRevalidate: ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname,
				ErrorBoundary: ErrorView,
				children: [
					{
						path: "new",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "NewEvent")
							});
						}
					},
					createRouteCaseForm("new/:caseName"),
					{
						path: "events",
						Component: AsyncEventTable,
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ request, params }) => {
								const search = getQueryParam(request, "q");
								return getEmployeeCaseChanges(params, search)
									.withQueryParam("searchTerm", search)
									.withQueryParam("orderBy", "created desc, id")
									.withQueryParam("substituteLookupCodes", true);
							}
						})
					},
					createRouteDataView("data", async ({ params }) => {
						const map = await store.get(missingEmployeeDataMapAtom);
						return {
							missingData: map.get(params.employeeId)
						};
					}),
					createRouteDocument(false),
					createRouteCaseForm("missingdata/:caseName"),
					{
						path: "missingdata",
						Component: AsyncCaseTable,
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "HRCT"),
								noDataAvailableText: "Data complete.",
							});
						}
					}
				]
			},
			{
				path: "hr/tasks",
				Component: AsyncTaskTable,
				loader: async ({ params, request }) => {
					const { user } = await getOrganizationData();
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
				path: "hr/missingdata",
				Component: MissingDataView,
				loader: () => {
					// refresh missing data
					store.set(missingDataEmployeesAtom);

					return defer({
						data: store.get(missingEmployeeDataMapAtom),
						title: "Missing data",
					});
				}
			},
			...createRouteCaseForms("hr/missingdata"),
			{
				path: "payrunperiods",
				id: "payrunperiods-root",
				children: [
					{
						index: true,
						Component: PayrunPeriodList,
						loader: paginatedLoader({
							pageCount: 15,
							name: "closedPayrunPeriods",
							getRequestBuilder: async ({ params }) => getClosedPayrunPeriods(params),
							getLoaderData: async ({ params }) => {
								return ({
									openPayrunPeriod: getOpenPayrunPeriod(params),
								})
							},
						}),
					},
					{
						path: ":payrunPeriodId",
						id: "payrunperiod",
						handle: {
							newEventRoot: true
						},
						shouldRevalidate: ({ nextUrl }) => nextUrl.pathname.endsWith("payrunperiods/open"),
						ErrorBoundary: PayrunErrorBoundary,
						loader: async ({ params }) => {
							const isOpen = params.payrunPeriodId === "open";
							const payrunPeriod = isOpen ? await getOpenPayrunPeriod(params) : await getPayrunPeriod(params);
							if (payrunPeriod === null) {
								throw new Response("Not found", { status: 404 });
							}
							const evalDate = dayjs().toISOString();
							const [
								previousPayrunPeriod,
								controllingTasksList,
								caseValueCounts,
								salaryTypes,
								bankAccountDetails
							] = await Promise.all([
								getPreviousPayrunPeriod(params, payrunPeriod.periodStart),
								isOpen ? getPayrunPeriodControllingTasks(params) : [],
								Promise.all(payrunPeriod.entries.map(e => getPayrunPeriodCaseValues({ ...params, employeeId: e.employeeId }, payrunPeriod.created, payrunPeriod.periodStart, payrunPeriod.periodEnd, true, evalDate))),
								Promise.all(payrunPeriod.entries.map(e => getEmployeeSalaryType({ ...params, employeeId: e.employeeId }, evalDate))),
								isOpen ? getCompanyBankAccountDetails(params, evalDate) : {}
							]);
							const controllingTasks = new Map(controllingTasksList.map(({ id, cases }) => [id, cases]));
							const salaryTypesSet = [...new Set(salaryTypes)].filter(Boolean).sort();
							return { payrunPeriod, previousPayrunPeriod, controllingTasks, caseValueCounts, salaryTypes, salaryTypesSet, bankAccountDetails };
						},
						children: [
							{
								index: true,
								id: "payrunperiodview",
								Component: PayrunDashboard,
								action: async ({ params, request }) => {
									const formData = await request.formData();
									const payrunPeriodId = formData.get("payrunPeriodId");
									const payout = JSON.parse(formData.get("payout"));
									const response1 = await createPayout({ ...params, payrunPeriodId }, payout);
									// const [response1, response2] = await Promise.all([createPayout({ ...params, payrunPeriodId }, payout), createPayout({ ...params, payrunPeriodId }, payout)]);
									if (response1.ok) {
										toast("success", "Payout created")
										const createdPayout = await response1.json();
										const bytes = base64ToBytes(createdPayout.painFile.content);
										const blob = new Blob([bytes], { type: createdPayout.painFile.contentType })
										await downloadData(blob, getPayoutFileName(createdPayout));
										return redirect("payouts");
									}
									toast("error", "Error while creating the payout");
									return null;
								}
							},
							{
								Component: PayrunDashboard,
								children: [
									createRoutePayrunPeriodDocument()
								]
							},
							{
								id: "payrunperiodreview",
								path: "review",
								Component: ReviewOpenPeriod,
								children: [
									createRoutePayrunPeriodDocument(),
								],
								loader: async ({ params }) => {
									if (!params.payrunPeriodId === "open") {
										return redirect("..");
									}
									return {
										payrunPeriod: await getOpenPayrunPeriod(params)
									};
								},
								action: async ({ params, request }) => {
									const formData = await request.formData();
									const payrunPeriodId = formData.get("payrunPeriodId");
									const closePeriodResponse = await closePayrunPeriod({ ...params, payrunPeriodId });
									if (closePeriodResponse.ok) {
										toast("success", "Payrun period closed");
										return redirect("..");
									}
									toast("error", "Could not close period");
								}
							},
							{
								path: "payouts",
								Component: Payouts,
								loader: async ({ params }) => {
									if (params.payrunPeriodId === "open") {
										const openPayrunPeriod = await getOpenPayrunPeriod(params);
										params.payrunPeriodId = openPayrunPeriod.id;
									}
									return getPayouts(params);
								},
								action: async ({ params, request }) => {
									const formData = await request.formData();
									const payrunPeriodId = formData.get("payrunPeriodId");
									const payoutId = formData.get("payoutId");
									const response = await cancelPayout({ ...params, payrunPeriodId, payoutId });
									if (response.ok) {
										toast("success", "Cancelled payout")
									} else {
										toast("error", "Error while cancelling the payout");
									}
									return null;
								}
							},
							{
								id: "payrunperioddocuments",
								path: "documents",
								Component: ClosedPeriodDocuments,
								children: [
									createRoutePayrunPeriodDocument(),
								]
							},
							{
								path: "employees/:employeeId/events",
								Component: PayrunDashboard,
								children: [
									{
										index: true,
										Component: PeriodCaseValueDialog,
										loader: async ({ params }) => {
											const fetcher = params.payrunPeriodId === "open" ? getOpenPayrunPeriod : getPayrunPeriod;
											const payrunPeriod = await fetcher(params);
											return getPayrunPeriodCaseValues(params, payrunPeriod.created, payrunPeriod.periodStart, payrunPeriod.periodEnd);
										}
									}
								]
							},
						]
					},
				]
			},
			...createRouteCaseForms("payrunperiods/:payrunPeriodId"),
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
				Component: withSuspense(CompanyTabbedView),
				shouldRevalidate: ({ currentUrl, nextUrl }) => currentUrl.pathname !== nextUrl.pathname,
				loader: async () => {
					store.set(missingDataCompanyAtom); // refresh
					store.set(onboardingCompanyAtom);
					return {
						pageTitle: "Company",
						missingData: await store.get(missingDataCompanyAtom),
						onboardingTaskCount: (await store.get(onboardingCompanyAtom)).length,
					}
				},
				children: [
					{
						path: "onboarding",
						Component: OnboardingView,
						loader: () => store.get(onboardingCompanyAtom),
					},
					createRouteCaseForm("onboarding/:caseName", {
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
					createRouteCaseForm("new/:caseName"),
					{
						path: "events",
						Component: AsyncEventTable,
						loader: paginatedLoader({
							pageCount: 10,
							getRequestBuilder: ({ params, request }) => {
								const search = getQueryParam(request, "q");
								return getCompanyCaseChanges(params, search, "created desc, id");
							},
						}),
					},
					createRouteDataView("data", async () => {
						return {
							missingData: await store.get(missingDataCompanyAtom)
						};
					}),
					createRouteCaseForm("missingdata/:caseName", {
						redirect: "../../data"
					}),
					createRouteDocument(false),
				],
			},
			{
				path: "employees/:employeeId",
				children: [
					{
						path: "new",
						Component: withPage("New event", AsyncCaseTable, true),
						loader: ({ params }) => {
							return defer({
								data: getEmployeeCases(params, "ESS"),
							});
						},
						children: [
							createRouteCaseForm(":caseName", { redirect: ".." }),
						]
					},
					{
						path: "missingdata",
						shouldRevalidate: () => true,
						Component: withPage("Missing data", AsyncCaseTable, true),
						loader: () => {
							// refresh missing data
							store.set(ESSMissingDataAtom);
							return defer({
								data: store.get(ESSMissingDataAtom),
							});
						},
						children: [
							createRouteCaseForm(":caseName", { redirect: ".." }),
						]
					},
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
