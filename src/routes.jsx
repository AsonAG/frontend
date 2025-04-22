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
import { AsyncEmployeeTable } from "./employee/EmployeeTable";
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
	getCompanyBankDetails as getCompanyBankAccountDetails,
	getEmployeeSalaryType,
	getPreviousPayrunPeriod,
	getLookupSet,
	addLookupValue,
	updateLookupValue,
	deleteLookupValue,
	getLookupValues,
	getPayrollCollectors
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
	onboardingCompanyAtom,
	payrollControllingDataAtom,
	clientRegulationAtom,
	payrollWageTypesWithMissingAccountInfoCountAtom,
	payrollWageTypesWithAccountingInfoAtom,
	fibuAccountLookupAtom,
	refreshPayrollWageTypes,
} from "./utils/dataAtoms";
import { paramsAtom } from "./utils/routeParamAtoms";
import { PayrunDashboard } from "./payrun/Dashboard";
import { MissingDataView } from "./components/MissingDataView";
import { EmployeeForm } from "./components/EmployeeForm";
import { ContentLayout, withPage, withSuspense } from "./components/ContentLayout";
import { NewTaskView } from "./components/NewTaskView";
import { OrganizationImport } from "./organization/Import";
import { OrganizationSettings } from "./organization/Settings";
import { getEmployeeDisplayString } from "./models/Employee";
import { DataValueHistory } from "./components/tables/DataTable";
import { DataView } from "./components/DataView";
import { MasterLookupTable } from "./components/MasterLookupTable";

import { PayrunPeriodList } from "./payrun/List";
import { ReviewOpenPeriod } from "./payrun/ReviewOpenPeriod";
import { getPayoutFileName, Payouts } from "./payrun/Payouts";
import { ClosedPeriodDocuments } from "./payrun/ClosedPeriodDocuments";
import { PeriodCaseValueDialog } from "./payrun/PeriodCaseValueDialog";
import { base64ToBytes } from "./services/converters/BinaryConverter";
import { CompanyTabbedView } from "./company/CompanyTabbedView";
import { OnboardingView } from "./company/OnboardingView";
import { PayrunErrorBoundary } from "./payrun/PayrunErrorBoundary";
import { WageTypeControlling } from "./company/WageTypeControlling";
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

function createRouteLookupForm(path, lookupName, keyName, loader) {
	const defaultLoader = async ({ params }) => {
		const regulation = await store.get(clientRegulationAtom);
		if (!regulation)
			return null;
		const lookup = await getLookupSet({ regulationId: regulation.id, ...params }, lookupName);
		return {
			lookup,
			keyName,
			regulationId: regulation.id,
		};
	};
	return {
		path,
		Component: MasterLookupTable,
		loader: async (arg) => {
			let data = await defaultLoader(arg);
			if (loader) {
				data = await loader(data, arg);
			}
			return data;
		},
		action: async ({ params, request }) => {
			const formData = await request.formData();
			const regulationId = formData.get("regulationId");
			const lookupId = formData.get("lookupId");
			const lookupValueId = formData.get("lookupValueId");
			const actionParams = { regulationId, lookupId, lookupValueId, ...params };
			let successMessage;
			let action;
			switch (request.method) {
				case "POST":
					action = addLookupValue(actionParams, {
						key: formData.get("key"),
						value: formData.get("value")
					});
					successMessage = "Created!";
					break;
				case "PUT":
					action = updateLookupValue(actionParams, {
						id: formData.get("lookupValueId"),
						key: formData.get("key"),
						value: formData.get("value")
					});
					successMessage = "Updated!";
					break;
				case "DELETE":
					action = deleteLookupValue(actionParams);
					successMessage = "Deleted!";
					break;
				default:
					throw new Response("", { status: 405 });
			}
			const response = await action;

			if (response.ok) {
				toast("success", successMessage);
				return { success: true };
			} else {
				toast("error", "Action failed");
				return null;
			}
		},
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
		loader: async ({ params }) => {
			return defer({
				showButtons,
				data: getEmployees(params).fetchJson(),
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
						isEmployed: employee.isEmployed,
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
							store.set(payrollControllingDataAtom);
							const [
								previousPayrunPeriod,
								controllingData,
								caseValueCounts,
								salaryTypes,
								bankAccountDetails
							] = await Promise.all([
								getPreviousPayrunPeriod(params, payrunPeriod.periodStart),
								isOpen ? store.get(payrollControllingDataAtom) : { employeeControllingCases: [], companyControllingCases: [] },
								Promise.all(payrunPeriod.entries.map(e => getPayrunPeriodCaseValues({ ...params, employeeId: e.employeeId }, payrunPeriod.created, payrunPeriod.periodStart, payrunPeriod.periodEnd, true, evalDate))),
								Promise.all(payrunPeriod.entries.map(e => getEmployeeSalaryType({ ...params, employeeId: e.employeeId }, evalDate))),
								isOpen ? getCompanyBankAccountDetails(params, evalDate) : {}
							]);
							const salaryTypesSet = [...new Set(salaryTypes)].filter(Boolean).sort();
							return { payrunPeriod, previousPayrunPeriod, controllingData, caseValueCounts, salaryTypes, salaryTypesSet, bankAccountDetails };
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
				path: "company",
				Component: withSuspense(CompanyTabbedView),
				shouldRevalidate: ({ currentUrl, nextUrl, actionResult }) => currentUrl.pathname !== nextUrl.pathname || actionResult?.success,
				loader: async () => {
					store.set(missingDataCompanyAtom); // refresh
					store.set(onboardingCompanyAtom);
					refreshPayrollWageTypes();
					const [
						missingData,
						onboardingTask,
						missingWageTypeAccountInfoCount
					] = await Promise.all([
						store.get(missingDataCompanyAtom),
						store.get(onboardingCompanyAtom),
						store.get(payrollWageTypesWithMissingAccountInfoCountAtom)
					]);
					return {
						pageTitle: "Company",
						missingData,
						missingWageTypeAccountInfoCount,
						onboardingTaskCount: onboardingTask.length,
					}
				},
				children: [
					{
						path: "onboarding",
						Component: OnboardingView,
						loader: () => store.get(onboardingCompanyAtom),
					},
					{
						path: "wagetypemaster",
						Component: WageTypeControlling,
						loader: async ({ params }) => {
							const regulation = await store.get(clientRegulationAtom);
							if (!regulation)
								return null;
							const [
								wageTypes,
								fibuAccountLookup,
								accountMaster,
								wageTypePayrollControllingLookup,
								wageTypeControlTypes,
								wageTypeAttributeTranslations,
								collectors
							] = await Promise.all([
								store.get(payrollWageTypesWithAccountingInfoAtom),
								store.get(fibuAccountLookupAtom),
								getLookupSet({ regulationId: regulation.id, ...params }, "AccountMaster"),
								getLookupSet({ regulationId: regulation.id, ...params }, "WageTypePayrollControlling"),
								getLookupValues(params, "CH.Swissdec.WageTypesControlTypes"),
								getLookupValues(params, "CH.Swissdec.WageTypeAttributes"),
								getPayrollCollectors(params)
							]);
							const accountMasterMap = new Map(accountMaster.values.map(x => [x.key, x]));
							const attributeTranslationMap = new Map(wageTypeAttributeTranslations.values.map(x => [x.key, x]));
							const controlTypesMap = new Map();
							for (const value of wageTypeControlTypes.values) {
								const keys = JSON.parse(value.key);
								if (!Array.isArray(keys) || keys.length !== 2)
									continue;
								if (!controlTypesMap.has(keys[0])) {
									controlTypesMap.set(keys[0], new Map());

								}
								controlTypesMap.get(keys[0]).set(keys[1], value.value);
							}
							return {
								wageTypes,
								collectors,
								fibuAccountLookup,
								wageTypePayrollControllingLookup,
								controlTypesMap,
								accountMaster,
								accountMasterMap,
								attributeTranslationMap,
								regulationId: regulation.id
							}
						},
						action: async ({ params, request }) => {
							const { lookupValue, ...requestParams } = await request.json();
							let action;
							switch (request.method) {
								case "POST":
									action = addLookupValue;
									break;
								case "PUT":
									action = updateLookupValue;
									break;
								case "DELETE":
									action = deleteLookupValue;
									break;
							}
							const response = await action({ ...params, ...requestParams, lookupValueId: lookupValue.id }, lookupValue);
							if (response.ok) {
								toast("success", "Updated!");
								return { success: true };
							} else {
								toast("error", "Action failed");
								return null;
							}
						}
					},
					createRouteLookupForm("accountmaster", "AccountMaster", "Account number", async (data, { params }) => {
						const wageTypes = await store.get(payrollWageTypesWithAccountingInfoAtom);
						const canDelete = (key) => {
							for (const wt of wageTypes) {
								if (wt.accountLookupValue?.value?.creditAccountNumber === key || wt.accountLookupValue?.value?.debitAccountNumber === key) {
									return [false, "This account is associated with a wage type"];
								}
							}
							return [true, null];
						}
						return {
							...data,
							canDelete
						}
					}),
					createRouteLookupForm("costcentermaster", "CostCenterMaster", "Cost center"),
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
