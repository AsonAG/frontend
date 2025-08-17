import { generatePath } from "react-router-dom";
import { authUserAtom, localUserEmailAtom } from "../auth/getUser";
import { getDefaultStore } from "jotai";
import { payrollAtom, userAtom } from "../utils/dataAtoms";
import { useOidc } from "../auth/authConfig";

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const availableRegulationsUrl = "/regulations/available";
const organizationsUrl = "/tenants";
const organizationImportUrl = "/tenants/import";
const organizationUrl = "/tenants/:orgId";
const organizationUserMembershipsUrl = "/tenants/:orgId/user_memberships";
const organizationUserMembershipUrl = "/tenants/:orgId/user_memberships/:userId";
const organizationUserMembershipRoleUrl = "/tenants/:orgId/user_memberships/:userId/role";
const organizationUserMembershipInviteUrl = "/tenants/:orgId/user_memberships/invite";
const payrollsUrl = "/tenants/:orgId/payrolls";
const payrollsSimpleUrl = "/tenants/:orgId/payrolls/simple";
const payrollUrl = "/tenants/:orgId/payrolls/:payrollId";
const payrollRegulationsUrl = "/tenants/:orgId/payrolls/:payrollId/regulations";
const divisionsUrl = "/tenants/:orgId/divisions";
const regulationsUrl = "/tenants/:orgId/regulations";
const lookupSetUrl = "/tenants/:orgId/regulations/:regulationId/lookups/sets";
const lookupValuesUrl = "/tenants/:orgId/regulations/:regulationId/lookups/:lookupId/values";
const lookupValueUrl = "/tenants/:orgId/regulations/:regulationId/lookups/:lookupId/values/:lookupValueId";
const caseSetsUrl = "/tenants/:orgId/payrolls/:payrollId/cases/sets";
const caseChangeCaseValuesUrl = "/tenants/:orgId/payrolls/:payrollId/changes/values";
const caseValueCountUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values/count";
const caseValuesUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values";
const timeValuesUrl = "/tenants/:orgId/payrolls/:payrollId/cases/values/time";
const missingDataCompanyUrl = "/tenants/:orgId/payrolls/:payrollId/missingdata";
const missingDataEmployeeUrl = "/tenants/:orgId/payrolls/:payrollId/missingdata/employees";
const payrollLookupValuesUrl = "/tenants/:orgId/payrolls/:payrollId/lookups/values";
const payrollEmployeesUrl = "/tenants/:orgId/payrolls/:payrollId/employees";
const payrollEmployeeUrl = "/tenants/:orgId/payrolls/:payrollId/employees/:employeeId";
const payrollWageTypeMasterUrl = "/tenants/:orgId/payrolls/:payrollId/wagetypemaster";
const payrollWageTypeSettingsUrl = "/tenants/:orgId/payrolls/:payrollId/wagetypemaster/settings";
const payrollCollectorsUrl = "/tenants/:orgId/payrolls/:payrollId/collectors";
const caseFieldsUrl = "/tenants/:orgId/payrolls/:payrollId/casefields";
const employeesUrl = "/tenants/:orgId/employees";
const employeeUrl = "/tenants/:orgId/employees/:employeeId";
const usersUrl = "/users";
const employeeCaseValuesUrl =
	"/tenants/:orgId/employees/:employeeId/cases";
const employeeDocumentUrl =
	"/tenants/:orgId/employees/:employeeId/cases/:caseValueId/documents/:documentId";
const companyDocumentUrl =
	"/tenants/:orgId/companycases/:caseValueId/documents/:documentId";
const tasksUrl = "/tenants/:orgId/payrolls/:payrollId/tasks";
const taskUrl = "/tenants/:orgId/payrolls/:payrollId/tasks/:taskId";
const payrunPeriodsUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods";
const payrunPeriodUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId";
const payrunPeriodCloseUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/close";
const payrunPeriodEntryRelevantEventValues = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/entries/:payrunPeriodEntryId/relevantEventValues";
const payrunPeriodDocumentsUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/documents";
const payrunPeriodDocumentUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/documents/:documentId";
const payrunPeriodControllingUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/open/controlling";
const payoutsUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/payouts";
const payoutUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/payouts/:payoutId";
const payoutDocumentUrl = "/tenants/:orgId/payrolls/:payrollId/payrunperiods/:payrunPeriodId/payouts/:payoutId/document";
const exportUrl = "/tenants/:orgId/export";
const invitationUrl = "/user_membership_invitations/:invitationId"

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
	addPayrollDivision = false;
	ignoreErrors = false;
	fallbackValue = null;
	timeout = 60000;
	retries = 0;

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

	withDefaultAcceptHeader() {
		this.headers.delete("Accept");
		return this;
	}

	withQueryParam(key, value) {
		if (value) {
			this.searchParams.set(key, value);
		}
		return this;
	}

	withQueryParams(key, value) {
		if (value) {
			this.searchParams.append(key, value);
		}
		return this;
	}

	withActive() {
		this.searchParams.set("status", "Active");
		return this;
	}

	withTimout(timeout) {
		this.timeout = timeout;
		this.signal = AbortSignal.timeout(timeout);
		return this;
	}

	withRetries(retry) {
		this.retries = retry;
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

		if (this.retries > 0) {
			return fetchWithTimeoutAndRetry(url, {
				method: this.method,
				headers: this.headers,
				body: this.body,
			}, this.timeout, this.retries);
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

export function createOrganization(name) {
	return new FetchRequestBuilder(organizationsUrl).withMethod("POST").withBody({identifier: name}).fetch();
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

export function getOrganizationUsers(routeParams) {
	return new FetchRequestBuilder(organizationUserMembershipsUrl, routeParams).fetchJson();
}


export function getOrganizationUserMembershipInvitations(routeParams) {
	return new FetchRequestBuilder(organizationUserMembershipsUrl + "/invitations", routeParams).fetchJson();
}


export function getOrganizationUser(routeParams) {
	return new FetchRequestBuilder(organizationUserMembershipsUrl, routeParams)
		.withQueryParam("filter", `id eq '${routeParams.userId}'`)
		.fetchSingle();
}

export function getOrganizationUserMembership(routeParams) {
	return new FetchRequestBuilder(organizationUserMembershipUrl, routeParams).fetchJson();
}

export function saveOrganizationUserRole(routeParams, userRole) {
	return new FetchRequestBuilder(organizationUserMembershipRoleUrl, routeParams)
		.withMethod("PUT")
		.withBody(userRole)
		.fetch();
}

export function inviteUserToOrganization(routeParams, inviteRequest) {
	return new FetchRequestBuilder(organizationUserMembershipInviteUrl, routeParams)
		.withMethod("POST")
		.withBody(inviteRequest)
		.fetch();
}
export function getInvitation(routeParams) {
	return new FetchRequestBuilder(invitationUrl, routeParams)
		.withIgnoreErrors(null)
		.fetchJson();
}

export function acceptInvitation(routeParams) {
	return new FetchRequestBuilder(invitationUrl, routeParams)
		.withMethod("POST")
		.fetch();
}

export function getPayrolls(routeParams) {
	return new FetchRequestBuilder(payrollsUrl, routeParams).fetchJson();
}

export function getPayroll(routeParams) {
	return new FetchRequestBuilder(payrollUrl, routeParams).fetchJson();
}

export function createPayroll(routeParams, payroll) {
	return new FetchRequestBuilder(payrollsSimpleUrl, routeParams)
		.withMethod("POST")
		.withBody(payroll)
		.fetch();
}

export function updatePayroll(routeParams, payroll) {
	return new FetchRequestBuilder(payrollUrl, routeParams)
		.withMethod("PUT")
		.withBody(payroll)
		.fetch();
}

export function getPayrollRegulations(routeParams) {
	return new FetchRequestBuilder(payrollRegulationsUrl, routeParams).fetchJson();
}

export function updatePayrollRegulations(routeParams, regulations) {
	return new FetchRequestBuilder(payrollRegulationsUrl, routeParams)
		.withMethod("PUT")
		.withBody(regulations)
		.fetch();
}

export function getAvailableRegulations(routeParams) {
	return new FetchRequestBuilder(availableRegulationsUrl, routeParams)
		.withLocalization()
		.fetchJson();
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
		.withQueryParam("orderBy", `firstName asc`);
}

export function getPayrollEmployees(routeParams) {
	return new FetchRequestBuilder(payrollEmployeesUrl, routeParams)
		.withQueryParam("orderBy", `firstName asc`);
}

export async function getEmployee(routeParams) {
	return new FetchRequestBuilder(payrollEmployeeUrl, routeParams).fetchJson();
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

export function getEmployeeCases(routeParams, clusterSetName, signal, evalDate = null) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("clusterSetName", clusterSetName)
		.withQueryParam("caseType", "Employee")
		.withQueryParam("orderBy", `name asc`)
		.withQueryParam("evaluationDate", evalDate)
		.withSignal(signal)
		.withLocalization()
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

export function getPayrunPeriodCaseValues(routeParams) {
	return new FetchRequestBuilder(payrunPeriodEntryRelevantEventValues, routeParams)
		.withLocalization()
		.fetchJson();
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
		.fetchJson();
}
export function getCaseValueCount(routeParams, minCount) {
	const caseType = routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(caseValueCountUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", caseType)
		.withQueryParam("minCount", minCount)
		.fetchJson();
}
export function getCurrentValues(routeParams) {
	const caseType = routeParams.employeeId ? "Employee" : "Company";
	return new FetchRequestBuilder(timeValuesUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", caseType)
		.withQueryParam("substituteLookupCodes", true)
		.withLocalization()
		.fetchJson()
}

export function getEmployeeCaseChanges(routeParams) {
	const url = payrollUrl + "/changes";
	return new FetchRequestBuilder(url, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParam("caseType", "Employee")
		.withLocalization()
}

export function getCompanyCases(routeParams, clusterSetName, signal) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withQueryParam("clusterSetName", clusterSetName)
		.withQueryParam("caseType", "Company")
		.withQueryParam("orderBy", `nameLocalizationsde asc`)
		.withSignal(signal)
		.withLocalization()
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
		.withLocalization();
}

export function getCompanyMissingDataCases(routeParams) {
	return new FetchRequestBuilder(missingDataCompanyUrl, routeParams)
		.withLocalization()
		.fetchJson();
}

export async function getEmployeeSalaryType(routeParams, evalDate = null) {
	const salaryType = "CH.Swissdec.EmployeeSalaryType"
	const caseValue = await new FetchRequestBuilder(timeValuesUrl, routeParams)
		.withQueryParam("caseType", "Employee")
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParams("caseFieldNames", salaryType)
		.withQueryParam("valueDate", evalDate)
		.withQueryParam("substituteLookupCodes", true)
		.withLocalization()
		.fetchSingle();

	return caseValue?.value;
}

export async function getEmployeeEmail(routeParams) {
	const emailCaseField = "CH.Swissdec.EmployeeEmail"
	const caseValue = await new FetchRequestBuilder(employeeCaseValuesUrl, routeParams)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withQueryParams("caseFieldName", emailCaseField)
		.withQueryParam("orderBy", "created desc")
		.withQueryParam("top", 1)
		.withLocalization()
		.fetchSingle();

	return caseValue?.value;
}

export async function getCompanyBankDetails(routeParams, evalDate = null) {
	const ibanFieldName = "CH.Swissdec.CompanyBankIban";
	const accountFieldName = "CH.Swissdec.CompanyBankName";
	const values = await new FetchRequestBuilder(timeValuesUrl, routeParams)
		.withQueryParam("caseType", "Company")
		.withQueryParams("caseFieldNames", ibanFieldName)
		.withQueryParams("caseFieldNames", accountFieldName)
		.withQueryParam("evaluationDate", evalDate)
		.fetchJson();

	const iban = values.find(v => v.caseFieldName === ibanFieldName)?.value;
	const accountName = values.find(v => v.caseFieldName === accountFieldName)?.value;

	return {
		iban,
		accountName
	};
}

export function getEmployeeMissingData(routeParams) {
	return new FetchRequestBuilder(missingDataEmployeeUrl, routeParams)
		.withLocalization()
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

export function getClosedPayrunPeriods(routeParams) {
	return new FetchRequestBuilder(payrunPeriodsUrl, routeParams)
		.withQueryParam("orderBy", "periodStart desc")
		.withQueryParam("filter", `periodStatus ne 'Open'`);
}

export function getPreviousPayrunPeriod(routeParams, payrunPeriodStart) {
	return new FetchRequestBuilder(payrunPeriodsUrl, routeParams)
		.withQueryParam("orderBy", "periodStart desc")
		.withQueryParam("filter", `periodStart lt '${payrunPeriodStart}'`)
		.withQueryParam("top", 1)
		.withQueryParam("loadRelated", true)
		.fetchSingle();
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
		.fetch();
}

export function createOpenPayrunPeriod(routeParams) {
	return new FetchRequestBuilder(payrunPeriodsUrl + "/open", routeParams)
		.withMethod("POST")
		.fetch();
}

export function getPayrunPeriodDocuments(routeParams) {
	return new FetchRequestBuilder(payrunPeriodDocumentsUrl, routeParams)
		.withTimout(2 * 60 * 1000)
		.withRetries(10)
		.fetch();
}

export function getPayrunPeriodControllingTasks(routeParams) {
	return new FetchRequestBuilder(payrunPeriodControllingUrl, routeParams)
		.withLocalization()
		.fetchJson();
}

export function getPayrunPeriodDocument(routeParams, report, variant) {
	return new FetchRequestBuilder(payrunPeriodDocumentUrl, routeParams)
		.withQueryParam("report", report)
		.withQueryParam("variant", variant)
		.fetchJson();
}

export function buildCase(routeParams, caseChangeSetup) {
	// manually construct path, generatePath does not handle encoding properly
	const url = caseSetsUrl + "/" + encodeURIComponent(routeParams.caseName);
	return new FetchRequestBuilder(url, routeParams)
		.withMethod("POST")
		.withBody(caseChangeSetup)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withLocalization()
		.fetch();
}

export function addCase(routeParams, caseChangeSetup) {
	return new FetchRequestBuilder(caseSetsUrl, routeParams)
		.withMethod("POST")
		.withBody(caseChangeSetup)
		.withQueryParam("employeeId", routeParams.employeeId)
		.withLocalization()
		.fetch();
}

export async function getUser() {
	return await new FetchRequestBuilder(usersUrl)
		.fetchSingle();
}

export function getLookupValues(routeParams, lookupName) {
	return new FetchRequestBuilder(payrollLookupValuesUrl, routeParams)
		.withQueryParam("lookupNames", lookupName)
		.withLocalization()
		.fetchSingle();
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

export function getPayouts(routeParams) {
	return new FetchRequestBuilder(payoutsUrl, routeParams)
		.withQueryParam("orderBy", "status asc, created desc")
		.fetchJson();
}

export function createPayout(routeParams, payoutSet) {
	return new FetchRequestBuilder(payoutsUrl, routeParams)
		.withMethod("POST")
		.withBody(payoutSet)
		.fetch();
}

export function cancelPayout(routeParams) {
	return new FetchRequestBuilder(payoutUrl, routeParams)
		.withMethod("POST")
		.fetch();
}

export function getClientRegulation(routeParams) {
	return new FetchRequestBuilder(regulationsUrl, routeParams)
		.withQueryParam("filter", `name eq 'ClientRegulation:${routeParams.payrollId}'`)
		.fetchSingle();
}

export function getLookupSet(routeParams, lookupName) {
	return new FetchRequestBuilder(lookupSetUrl, routeParams)
		.withQueryParam("filter", `name eq '${lookupName}'`)
		.fetchSingle();
}

export function addLookupValue(routeParams, lookupValue) {
	return new FetchRequestBuilder(lookupValuesUrl, routeParams)
		.withMethod("POST")
		.withBody(lookupValue)
		.fetch();
}
export function updateLookupValue(routeParams, lookupValue) {
	return new FetchRequestBuilder(lookupValueUrl, routeParams)
		.withMethod("PUT")
		.withBody(lookupValue)
		.fetch();
}
export function deleteLookupValue(routeParams) {
	return new FetchRequestBuilder(lookupValueUrl, routeParams)
		.withMethod("DELETE")
		.fetch();
}

export function getPayrollWageTypes(routeParams) {
	return new FetchRequestBuilder(payrollWageTypeMasterUrl, routeParams)
		.withLocalization()
		.fetchJson();
}
export function getPayrollWageTypeSettings(routeParams) {
	return new FetchRequestBuilder(payrollWageTypeSettingsUrl, routeParams)
		.fetchJson();
}
export function setPayrollWageTypeSettings(routeParams, settings) {
	return new FetchRequestBuilder(payrollWageTypeSettingsUrl, routeParams)
		.withMethod("PATCH")
		.withBody(settings)
		.fetch();
}
export function getPayrollCollectors(routeParams) {
	return new FetchRequestBuilder(payrollCollectorsUrl, routeParams)
		.withLocalization()
		.fetchJson();
}

export async function requestExportDataDownload(routeParams, name) {
	const builder = new FetchRequestBuilder(
		exportUrl,
		routeParams,
	);
	const response = await builder.withTimout(600000).fetch();
	const blob = await response.blob();
	await downloadData(blob, name);
}

export async function downloadData(blob, name) {
	let objectUrl = window.URL.createObjectURL(blob);
	let anchor = document.createElement("a");
	try {
		anchor.href = objectUrl;
		if (name)
			anchor.download = name;
		anchor.click();
	} finally {
		window.URL.revokeObjectURL(objectUrl);
		anchor.remove();
	}

}

export async function requestPainFileDownload(routeParams, name) {
	const builder = new FetchRequestBuilder(
		payoutDocumentUrl,
		routeParams,
	)
		.withDefaultAcceptHeader();
	const response = await builder.fetch();
	const blob = await response.blob();
	await downloadData(blob, name);
}

async function fetchWithTimeoutAndRetry(url, options = {}, timeout = 5000, maxRetries = 3) {
	let attempt = 0;

	const fetchWithTimeout = (url, options, timeout) => {
		return new Promise((resolve, reject) => {
			const controller = new AbortController();
			const timer = setTimeout(() => {
				controller.abort();
				reject(new Error('Timeout'));
			}, timeout);

			fetch(url, { ...options, signal: controller.signal })
				.then(response => {
					clearTimeout(timer);
					resolve(response);
				})
				.catch(err => {
					clearTimeout(timer);
					reject(err);
				});
		});
	};

	while (attempt < maxRetries) {
		try {
			const response = await fetchWithTimeout(url, options, timeout);
			return response; // success
		} catch (err) {
			if (err.name === 'AbortError' || err.message === 'Timeout') {
				attempt++;
				if (attempt >= maxRetries) {
					throw new Error(`Failed after ${maxRetries} retries due to timeout.`);
				}
			} else {
				// For other errors, don't retry
				throw err;
			}
		}
	}
}
