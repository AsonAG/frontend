import { generatePath } from "react-router-dom";
import { authUserAtom, localUserEmailAtom } from "../auth/getUser";
import { getDefaultStore } from "jotai";
import { payrollAtom, userAtom } from "../utils/dataAtoms";
import { useOidc } from "../auth/authConfig";

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const organizationsUrl = "/tenants";
const organizationImportUrl = "/tenants/import";
const organizationUrl = "/tenants/:orgId";
const payrollsUrl = "/tenants/:orgId/payrolls";
const payrollUrl = "/tenants/:orgId/payrolls/:payrollId";
const payrollRegulationsUrl = "/tenants/:orgId/payrolls/:payrollId/regulations";
const divisionsUrl = "/tenants/:orgId/divisions";
const caseSetsUrl = "/tenants/:orgId/payrolls/:payrollId/cases/sets";
const caseChangeCaseValuesUrl = "/tenants/:orgId/payrolls/:payrollId/changes/values";
const caseValueCountUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values/count";
const caseValuesUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values";
const timeValuesUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values/time";
const missingDataCompanyUrl = "/tenants/:orgId/payrolls/:payrollId/missingdata";
const missingDataEmployeeUrl = "/tenants/:orgId/payrolls/:payrollId/missingdata/employees";
const lookupValuesUrl = "/tenants/:orgId/payrolls/:payrollId/lookups/values";
const payrollEmployeesUrl = "/tenants/:orgId/payrolls/:payrollId/employees";
const caseFieldsUrl = "/tenants/:orgId/payrolls/:payrollId/casefields";
const employeesUrl = "/tenants/:orgId/employees";
const employeeUrl = "/tenants/:orgId/employees/:employeeId";
const usersUrl = "/tenants/:orgId/users";
const employeeDocumentUrl =
	"/tenants/:orgId/employees/:employeeId/cases/:caseValueId/documents/:documentId";
const companyDocumentUrl =
	"/tenants/:orgId/companycases/:caseValueId/documents/:documentId";
const tasksUrl = "/tenants/:orgId/payrolls/:payrollId/tasks";
const taskUrl = "/tenants/:orgId/payrolls/:payrollId/tasks/:taskId";
const payrunsUrl = "/tenants/:orgId/payruns";
const payrunPeriodsUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods";
const payrunPeriodUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId";
const payrunPeriodCloseUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/close";
const payrunPeriodDocumentsUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/documents";
const payrunPeriodDocumentUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/documents/:documentId";
const payrollResultsUrl =
	"/tenants/:orgId/payrollresults";
const wageTypesUrl =
	"/tenants/:orgId/payrollresults/:payrollResultId/wagetypes";
const reportsUrl = "/tenants/:orgId/payrolls/:payrollId/reports";
const buildReportUrl =
	"/tenants/:orgId/payrolls/:payrollId/reports/:reportId/build";
const generateReportUrl =
	"/tenants/:orgId/payrolls/:payrollId/reports/:reportId/generate";
const exportUrl = "/tenants/:orgId/export";

const store = getDefaultStore();

class FetchRequestBuilder {
	method = "GET";
	headers = new Headers();
	searchParams = new URLSearchParams();
	signal = AbortSignal.timeout(60000);
	localizeRequest = false;
	body = null;
	url = null;
	routeParams = {};
	addUserQueryParam = false;
	addPayrollDivision = false;
	ignoreErrors = false;
	fallbackValue = null;

	constructor(url, routeParams) {
		if (!url) {
			throw new Error("Url cannot be empty");
		}
		this.url = baseUrl + generatePath(url, routeParams);
		this.routeParams = routeParams || {};

		if (useOidc) {
			const authUser = store.get(authUserAtom);
			this.headers.set("Authorization", `Bearer ${authUser?.access_token}`);
		} else {
			this.headers.set("X_ASON_USER_IDENTIFIER", store.get(localUserEmailAtom));
		}
		this.headers.set("Accept", "application/json");
		this.headers.set("Content-Type", "application/json");
	}

	withRouteParams(routeParams) {
		this.routeParams = routeParams;
		return this;
	}

	withMethod(method) {
		this.method = method;
		return this;
	}

	withLocalization() {
		this.localizeRequest = true;
		return this;
	}

	withBody(body) {
		if (body) {
			this.body = JSON.stringify(body);
		}
		return this;
	}

	withFileBody(body) {
		if (body) {
			this.body = body;
			this.headers.delete("Content-Type");
		}
		return this;
	}

	withQueryParam(key, value) {
		if (value) {
			this.searchParams.set(key, value);
		}
		return this;
	}

	withActive() {
		this.searchParams.set("status", "Active");
		return this;
	}

	withTimout(timeout) {
		this.signal = AbortSignal.timeout(timeout);
		return this;
	}

	withUser() {
		this.addUserQueryParam = true;
		return this;
	}

	withPayrollDivision() {
		this.addPayrollDivision = true;
		return this;
	}

	withSignal(signal /*: AbortSignal*/) {
		if (signal) {
			this.signal = AbortSignal.any([signal, this.signal]);
		}
		return this;
	}

	withIgnoreErrors(fallbackValue) {
		this.ignoreErrors = true;
		if (fallbackValue !== undefined) {
			this.fallbackValue = fallbackValue
		}
		return this;
	}

	withPagination(page, pageCount) {
		return this.withQueryParam("top", pageCount)
			.withQueryParam("skip", page * pageCount)
			.withQueryParam("result", "ItemsWithCount");
	}

	async fetch() {
		if (this.localizeRequest) {
			const user = await store.get(userAtom);
			if (user !== null) this.searchParams.set("language", user.language);
		}
		if (this.addUserQueryParam) {
			const user = await store.get(userAtom);
			if (user !== null) this.searchParams.set("userId", user.id);
		}
		if (this.addPayrollDivision) {
			const payroll = await store.get(payrollAtom);
			if (payroll !== null) {
				this.searchParams.set("divisionId", payroll.divisionId);
			}
		}
		let url = this.url;
		if ([...this.searchParams].length > 0) {
			url = `${url}?${this.searchParams}`;
		}

		return fetch(url, {
			method: this.method,
			headers: this.headers,
			body: this.body,
			signal: this.signal,
		});
	}

	async fetchJson() {
		const response = await this.fetch();
		if (this.ignoreErrors && !response.ok) {
			return this.fallbackValue;
		}
		return response.json();
	}

	async fetchSingle() {
		const response = await this.fetchJson();
		return Array.isArray(response) && response.length === 1
			? response[0]
			: null;
	}
}

export function getOrganizations() {
	return new FetchRequestBuilder(organizationsUrl).fetchJson();
}

export function importOrganization(body) {
	return new FetchRequestBuilder(organizationImportUrl).withMethod("POST").withTimout(600000).withFileBody(body).fetch();
}

export function getOrganization(routeParams) {
	return new FetchRequestBuilder(organizationUrl, routeParams).fetchJson();
}

export function deleteOrganization(routeParams) {
	return new FetchRequestBuilder(organizationUrl, routeParams).withMethod("DELETE").fetch();
}

export function getPayrolls(routeParams) {
	return new FetchRequestBuilder(payrollsUrl, routeParams).fetchJson();
}

export function getPayroll(routeParams) {
	return new FetchRequestBuilder(payrollUrl, routeParams).fetchJson();
}

export function getRegulations(routeParams) {
	return new FetchRequestBuilder(payrollRegulationsUrl, routeParams).fetchJson();
}

export function getDivisions(routeParams) {
	return new FetchRequestBuilder(divisionsUrl, routeParams).fetchJson();
}

export function getDivision(routeParams, divisionId) {
	const builder = new FetchRequestBuilder(
		divisionsUrl,
		routeParams,
	).withQueryParam("filter", `id eq '${divisionId}'`);
	return builder.fetchSingle();
}

export function getEmployees(routeParams) {
	return new FetchRequestBuilder(employeesUrl, routeParams)
		.withPayrollDivision()
		.withQueryParam("orderBy", `firstName asc`);
}

export async function getEmployee(routeParams) {
	return new FetchRequestBuilder(employeeUrl, routeParams).fetchJson();
}

export async function createEmployee(routeParams, employee) {
	return new FetchRequestBuilder(employeesUrl, routeParams)
		.withMethod("POST")
		.withBody(employee)
		.withLocalization()
		.fetch();
}

export function updateEmployee(routeParams, employee) {
	return new FetchRequestBuilder(employeeUrl, routeParams)
		.withMethod("PUT")
		.withBody(employee)
		.withLocalization()
		.fetch();
}

export function getEmployeeByIdentifier(routeParams, identifier) {
	return new FetchRequestBuilder(payrollEmployeesUrl, routeParams)
		.withQueryParam("filter", `Identifier eq '${identifier}'`)
		.fetchSingle();
}

export function getEmployeeCases(routeParams, clusterSetName, signal) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("clusterSetName", clusterSetName)
		.withQueryParam("caseType", "Employee")
		.withQueryParam("orderBy", `name asc`)
		.withSignal(signal)
		.withLocalization()
		.withUser()
		.withIgnoreErrors([])
		.fetchJson();
}

export function getCaseValues(routeParams, caseFieldName, start, end) {
	return new FetchRequestBuilder(caseValuesUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseFieldNames", caseFieldName)
		.withQueryParam("startDate", (start?.toISOString() ?? "1970-01-01T00:00:00.00000Z"))
		.withQueryParam("endDate", (end?.toISOString() ?? "2345-01-01T00:00:00.00000Z"))
		.fetchJson();
}

export function getPayrunPeriodCaseValues(routeParams, payrunPeriodOpened, payrunPeriodStart, payrunPeriodEnd, asCount = false) {
	return new FetchRequestBuilder(caseChangeCaseValuesUrl, routeParams)
		.withQueryParam("caseType", "Employee")
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("filter", `(created gt '${payrunPeriodOpened}' and start le '${payrunPeriodEnd}') or (start gt '${payrunPeriodStart}' and start le '${payrunPeriodEnd}')`)
		.withQueryParam("orderBy", "created desc")
		.withQueryParam("substituteLookupCodes", !asCount)
		.withQueryParam("result", asCount ? "Count" : undefined)
		.withLocalization()
		.withUser()
		.fetchJson()
}

export function getCaseChangeCaseValues(routeParams, top) {
	const caseType = routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(caseChangeCaseValuesUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("filter", `CaseFieldName eq '${routeParams.caseFieldName}'`)
		.withQueryParam("caseType", caseType)
		.withQueryParam("orderBy", "created desc")
		.withQueryParam("substituteLookupCodes", true)
		.withQueryParam("top", top)
		.withQueryParam("result", !!top ? "ItemsWithCount" : undefined)
		.withLocalization()
		.withUser()
		.fetchJson();
}
export function getCaseValueCount(routeParams, minCount) {
	const caseType = routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(caseValueCountUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", caseType)
		.withQueryParam("minCount", minCount)
		.withUser()
		.fetchJson();
}
export function getCurrentValues(routeParams) {
	const caseType = routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(timeValuesUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", caseType)
		.withQueryParam("substituteLookupCodes", true)
		.withLocalization()
		.withUser()
		.fetchJson()
}

export function getEmployeeCaseChanges(routeParams) {
	const url = payrollUrl + "/changes";
	return new FetchRequestBuilder(url, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", "Employee")
		.withLocalization()
		.withUser();
}

export function getCompanyCases(routeParams, clusterSetName, signal) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withQueryParam("clusterSetName", clusterSetName)
		.withQueryParam("caseType", "Company")
		.withQueryParam("orderBy", `nameLocalizationsde asc`)
		.withSignal(signal)
		.withLocalization()
		.withUser()
		.withIgnoreErrors([])
		.fetchJson();
}

export function getCompanyCaseChanges(routeParams, search, orderBy) {
	const url = payrollUrl + "/changes";
	return new FetchRequestBuilder(url, routeParams)
		.withQueryParam("caseType", "Company")
		.withQueryParam("searchTerm", search)
		.withQueryParam("orderBy", orderBy)
		.withQueryParam("substituteLookupCodes", true)
		.withLocalization()
		.withUser();
}

export function getCompanyMissingDataCases(routeParams) {
	return new FetchRequestBuilder(missingDataCompanyUrl, routeParams)
		.withLocalization()
		.withUser()
		.fetchJson();
}

export function getEmployeeMissingData(routeParams) {
	return new FetchRequestBuilder(missingDataEmployeeUrl, routeParams)
		.withLocalization()
		.withUser()
		.fetchJson();
}

export function getTasks(routeParams, filter, orderBy) {
	return new FetchRequestBuilder(tasksUrl, routeParams)
		.withQueryParam("filter", filter)
		.withQueryParam("orderBy", orderBy)
		.withQueryParam("result", "ItemsWithCount")
		.withLocalization()
		.fetchJson();
}

export function getTask(routeParams) {
	return new FetchRequestBuilder(taskUrl, routeParams)
		.withLocalization()
		.fetchJson();
}

export function addTask(routeParams, task) {
	return new FetchRequestBuilder(tasksUrl, routeParams)
		.withMethod("POST")
		.withBody(task)
		.fetch();
}

export function updateTask(routeParams, task) {
	return new FetchRequestBuilder(taskUrl, routeParams)
		.withMethod("PUT")
		.withBody(task)
		.fetch();
}

export function getPayrun(routeParams) {
	return new FetchRequestBuilder(payrunsUrl, routeParams)
		.withQueryParam("filter", `payrollId eq '${routeParams.payrollId}'`)
		.fetchSingle();
}

export function getClosedPayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodsUrl, routeParams)
		.withQueryParam("orderBy", "periodStart desc")
		.withQueryParam("filter", `periodStatus ne 'Open'`);
}

export function getPayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodUrl, routeParams)
		.fetchJson();
}
export function getOpenPayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodsUrl, routeParams)
		.withQueryParam("filter", "PeriodStatus eq 'Open'")
		.withQueryParam("loadRelated", "true")
		.fetchSingle();
}

export function closePayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodCloseUrl, routeParams)
		.withMethod("POST")
		.withUser()
		.fetch();
}

export function createOpenPayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodsUrl + "/open", routeParams)
		.withMethod("POST")
		.withUser()
		.fetch();
}

export function getPayrunPeriodDocuments(routeParams) {
	return new FetchRequestBuilder(payrunPeriodDocumentsUrl, routeParams).fetchJson();
}

export function getPayrunPeriodDocument(routeParams, report, variant) {
	return new FetchRequestBuilder(payrunPeriodDocumentUrl, routeParams)
		.withQueryParam("report", report)
		.withQueryParam("variant", variant)
		.fetchJson();
}

export function getReports(routeParams, clusterSet) {
	return new FetchRequestBuilder(reportsUrl, routeParams)
		.withQueryParam("clusterSetName", clusterSet)
		.withLocalization()
		.fetchJson();
}

export function getReport(routeParams, reportRequest, signal) {
	return new FetchRequestBuilder(buildReportUrl, routeParams)
		.withMethod("POST")
		.withBody(reportRequest)
		.withLocalization()
		.withSignal(signal)
		.fetch();
}

export function generateReport(routeParams, reportRequest, format) {
	return new FetchRequestBuilder(generateReportUrl, routeParams)
		.withMethod("POST")
		.withBody(reportRequest)
		.withTimout(10 * 60 * 1000)
		.withQueryParam("format", format)
		.fetch();
}

export function buildCase(routeParams, caseChangeSetup) {
	// manually construct path, generatePath does not handle encoding properly
	const url = caseSetsUrl + "/" + encodeURIComponent(routeParams.caseName);
	return new FetchRequestBuilder(url, routeParams)
		.withMethod("POST")
		.withBody(caseChangeSetup)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withLocalization()
		.withUser()
		.fetch();
}

export function addCase(routeParams, caseChangeSetup) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withMethod("POST")
		.withBody(caseChangeSetup)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withLocalization()
		.withUser()
		.fetch();
}

export async function getUser(routeParams, identifier) {
	const users = await new FetchRequestBuilder(usersUrl, routeParams)
		.withQueryParam("filter", `Identifier eq '${identifier}'`)
		.fetchJson();
	const user = users?.length ? users[0] : null;
	return user;
}

export function getLookupValues(routeParams, lookupName) {
	return new FetchRequestBuilder(lookupValuesUrl, routeParams)
		.withQueryParam("lookupNames", lookupName)
		.withLocalization()
		.fetchJson();
}

export function getDocumentCaseFields(routeParams) {
	const caseType = !!routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(caseFieldsUrl, routeParams)
		.withQueryParam("caseType", caseType)
		.withQueryParam("valueType", "Document")
		.withLocalization()
		.fetchJson();
}

export function getDocumentsOfCaseField(routeParams, caseFieldName, top) {
	const url = payrollUrl + "/changes/values";
	const caseType = !!routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(url, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", caseType)
		.withQueryParam("orderBy", "start desc")
		.withQueryParam("result", top ? "ItemsWithCount" : undefined)
		.withQueryParam("top", top)
		.withQueryParam("filter", `CaseFieldName eq '${caseFieldName}' and DocumentCount gt 0`)
		.withLocalization()
		.withUser()
		.fetchJson();
}

export function getDocument(routeParams) {
	const url = routeParams.employeeId ? employeeDocumentUrl : companyDocumentUrl;

	return new FetchRequestBuilder(url, routeParams).fetchJson();
}

export function deleteDocument(routeParams) {
	const url = routeParams.employeeId ? employeeDocumentUrl : companyDocumentUrl;

	return new FetchRequestBuilder(url, routeParams)
		.withMethod("DELETE")
		.fetch();
}

export function getPayrollResult(routeParams, period, employeeId) {
	return new FetchRequestBuilder(payrollResultsUrl, routeParams)
		.withQueryParam("filter", `PayrollId eq '${routeParams.payrollId}' and EmployeeId eq '${employeeId}' and PeriodName eq '${period}'`)
		.withQueryParam("orderBy", "created desc")
		.withQueryParam("top", 1)
		.fetchSingle();
}

export function getWageTypes(routeParams, payrollResultId) {
	return new FetchRequestBuilder(wageTypesUrl, { ...routeParams, payrollResultId })
		.fetchJson();
}

export async function requestExportDataDownload(routeParams, name) {
	const builder = new FetchRequestBuilder(
		exportUrl,
		routeParams,
	);
	const response = await builder.withTimout(600000).fetch();
	const blob = await response.blob();
	let objectUrl = window.URL.createObjectURL(blob);
	let anchor = document.createElement("a");
	try {
		anchor.href = objectUrl;
		anchor.download = name;
		anchor.click();
	} finally {
		window.URL.revokeObjectURL(objectUrl);
		anchor.remove();
	}
}
