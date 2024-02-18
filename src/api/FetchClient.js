import { generatePath } from 'react-router-dom';
import { getAuthUser, localUserEmailAtom } from '../auth/getUser';
import { getDefaultStore } from 'jotai';
import { payrollAtom, userAtom } from '../utils/dataAtoms';
import { useOidc } from '../auth/authConfig';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl          = "/tenants";
const tenantUrl           = "/tenants/:tenantId";
const payrollsUrl         = "/tenants/:tenantId/payrolls";
const payrollUrl          = "/tenants/:tenantId/payrolls/:payrollId";
const divisionsUrl        = "/tenants/:tenantId/divisions";
const caseSetsUrl         = "/tenants/:tenantId/payrolls/:payrollId/cases/sets";
const lookupValuesUrl     = "/tenants/:tenantId/payrolls/:payrollId/lookups/values";
const payrollEmployeesUrl = "/tenants/:tenantId/payrolls/:payrollId/employees";
const caseFieldsUrl       = "/tenants/:tenantId/payrolls/:payrollId/casefields";
const employeesUrl        = "/tenants/:tenantId/employees";
const employeeUrl         = "/tenants/:tenantId/employees/:employeeId";
const usersUrl            = "/tenants/:tenantId/users";
const employeeDocumentUrl = "/tenants/:tenantId/employees/:employeeId/cases/:caseValueId/documents/:documentId";
const companyDocumentUrl  = "/tenants/:tenantId/companycases/:caseValueId/documents/:documentId";
const tasksUrl            = "/tenants/:tenantId/payrolls/:payrollId/tasks";
const taskUrl             = "/tenants/:tenantId/payrolls/:payrollId/tasks/:taskId";
const payrunsUrl          = "/tenants/:tenantId/payruns";
const payrunParametersUrl = "/tenants/:tenantId/payruns/:payrunId/parameters";
const payrunJobsUrl       = "/tenants/:tenantId/payruns/jobs";
const payrunJobStatusUrl  = "/tenants/:tenantId/payruns/jobs/:payrunJobId/status";
const complianceUrl       = "/tenants/:tenantId/payrolls/:payrollId/compliance";
const complianceSettingsUrl       = "/tenants/:tenantId/payrolls/:payrollId/compliance/settings";
const complianceCertificatesUrl       = "/tenants/:tenantId/payrolls/:payrollId/compliance/certificates";
const complianceDocumentsUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/documents";
const generateComplianceDocumentUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/documents/generate";
const complianceDocumentUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/documents/:documentId";
const complianceSubmissionsUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/submissions";
const complianceSubmissionUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/submissions/:submissionId";
const complianceMessagesUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/messages";
const compliancePingUrl   = "/tenants/:tenantId/payrolls/:payrollId/compliance/ping";
const complianceCheckInteroperabilityUrl = "/tenants/:tenantId/payrolls/:payrollId/compliance/checkinteroperability";
const reportsUrl = "/tenants/:tenantId/payrolls/:payrollId/reports";
const buildReportUrl = "/tenants/:tenantId/payrolls/:payrollId/reports/:reportId/build";
const generateReportUrl = "/tenants/:tenantId/payrolls/:payrollId/reports/:reportId/generate";

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

    constructor(url, routeParams) {
        if (!url) {
            throw new Error("Url cannot be empty");
        }
        this.url = baseUrl + generatePath(url, routeParams);
        this.routeParams = routeParams || {};

        if (useOidc) {
            const authUser = getAuthUser();
            this.headers.set('Authorization', `Bearer ${authUser?.access_token}`);
        } else {
            this.headers.set('X_ASON_USER_IDENTIFIER', store.get(localUserEmailAtom));
        }
        this.headers.set('Accept', 'application/json');
        this.headers.set('Content-Type', 'application/json');
        
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
        if(body) {
            this.body = JSON.stringify(body);
        }
        return this;
    }

    withQueryParam(key, value) {
        if(value) {
            this.searchParams.set(key, value);
        }
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
    
    withSignal(signal/*: AbortSignal*/) {
        if (signal) {
            this.signal = AbortSignal.any([signal, this.signal]);
        }
        return this;
    }

    withPagination(page, pageCount) {
        return this
            .withQueryParam("top", pageCount)
            .withQueryParam("skip", page * pageCount)
            .withQueryParam("result", "ItemsWithCount");
    }

    async fetch() {
        if (this.localizeRequest) {
            const user = await store.get(userAtom);
            if (user !== null)
                this.searchParams.set("language", user.language);
        }
        if (this.addUserQueryParam) {
            const user = await store.get(userAtom);
            if (user !== null)
                this.searchParams.set("userId", user.id);
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
            signal: this.signal
        });
    }

    async fetchJson() {
        return (await this.fetch()).json();
    }

    async fetchSingle() {
        const response = await this.fetchJson();
        return Array.isArray(response) && response.length === 1 ? response[0] : null;
    }

}

export function getTenants() {
    return new FetchRequestBuilder(tenantsUrl).fetch();
}

export function getTenant(routeParams) {
    return new FetchRequestBuilder(tenantUrl, routeParams).fetchJson();
}

export function getPayrolls(routeParams) {
    return new FetchRequestBuilder(payrollsUrl, routeParams).fetchJson();
}

export function getPayroll(routeParams) {
    return new FetchRequestBuilder(payrollUrl, routeParams).fetchJson();
}

export function getDivision(routeParams, divisionId) {
    const builder = new FetchRequestBuilder(divisionsUrl, routeParams)
        .withQueryParam("filter", `id eq '${divisionId}'`);
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

export function getEmployeeCases(routeParams, clusterSetName) {
    return new FetchRequestBuilder(caseSetsUrl, routeParams)
        .withQueryParam("employeeId", routeParams.employeeId)
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Employee")
        .withQueryParam("orderBy", `name asc`)
        .withLocalization()
        .withUser()
        .fetchJson();
}

export function getEmployeeCaseChanges(routeParams, filter, orderBy) {
    const url = payrollUrl + "/changes";
    return new FetchRequestBuilder(url, routeParams)
        .withQueryParam("employeeId", routeParams.employeeId)
        .withQueryParam("caseType", "Employee")
        .withQueryParam("filter", filter)
        .withQueryParam("orderBy", orderBy)
        .withLocalization()
        .withUser();
}

export function getCompanyCases(routeParams, clusterSetName) {
    return new FetchRequestBuilder(caseSetsUrl, routeParams)
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Company")
        .withQueryParam("orderBy", `nameLocalizationsde asc`)
        .withLocalization()
        .withUser()
        .fetchJson();
}

export function getCompanyCaseChanges(routeParams, filter, orderBy) {
    const url = payrollUrl + "/changes";
    return new FetchRequestBuilder(url, routeParams)
        .withQueryParam("caseType", "Company")
        .withQueryParam("filter", filter)
        .withQueryParam("orderBy", orderBy)
        .withLocalization()
        .withUser();
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

export function updateTask(routeParams, task) {
    return new FetchRequestBuilder(taskUrl, routeParams)
        .withMethod("PUT")
        .withBody(task)
        .fetch();
}

export function getPayruns(routeParams) {
    return new FetchRequestBuilder(payrunsUrl, routeParams)
        .withQueryParam("filter", `payrollId eq '${routeParams.payrollId}'`)
        .fetchJson();
}

export function getDraftPayrunJobs(routeParams) {
    return new FetchRequestBuilder(payrunJobsUrl, routeParams)
        .withQueryParam("filter", `payrollId eq '${routeParams.payrollId}' and jobStatus eq 'Draft'`)
        .fetchJson();
}

export function getPayrunJobs(routeParams) {
    return new FetchRequestBuilder(payrunJobsUrl, routeParams)
        .withQueryParam("filter", `payrollId eq '${routeParams.payrollId}' and payrunId eq '${routeParams.payrunId}' and jobStatus ne 'Draft'`)
        .withQueryParam("orderBy", "periodStart desc")
        .withQueryParam("result", "ItemsWithCount")
        .withQueryParam("top", 15)
        .fetchJson();
}

export function getPayrunParameters(routeParams) {
    return new FetchRequestBuilder(payrunParametersUrl, routeParams)
        .fetchJson();
}

export function startPayrunJob(routeParams, jobInvocation) {
    return new FetchRequestBuilder(payrunJobsUrl, routeParams)
        .withMethod("POST")
        .withBody(jobInvocation)
        .withTimout(10 * 60 * 1000)
        .fetch();
}

export function changePayrunJobStatus(routeParams, newStatus) {
    return new FetchRequestBuilder(payrunJobStatusUrl, routeParams)
        .withMethod("POST")
        .withQueryParam("patchMode", "true")
        .withBody(newStatus)
        .fetch();
}

export function getReports(routeParams) {
    return new FetchRequestBuilder(reportsUrl, routeParams)
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
        .withQueryParam("result", "ItemsWithCount")
        .withQueryParam("top", top)
        .withQueryParam("filter", `CaseFieldName eq '${caseFieldName}'`)
        .withLocalization()
        .withUser()
        .fetchJson();
}

export function getDocument(routeParams) {
    const url = routeParams.employeeId ? 
        employeeDocumentUrl :
        companyDocumentUrl;

    return new FetchRequestBuilder(url, routeParams).fetchJson();
}

export function getCompliance(routeParams) {
    return new FetchRequestBuilder(complianceUrl, routeParams)
        .withLocalization()
        .fetchJson();
}

export function getComplianceSettings(routeParams) {
    return new FetchRequestBuilder(complianceSettingsUrl, routeParams)
        .fetchJson();
}

export function setComplianceSettings(routeParams, settings) {
    return new FetchRequestBuilder(complianceSettingsUrl, routeParams)
        .withMethod("POST")
        .withBody(settings)
        .fetch();
}

export function getComplianceCertificates(routeParams, type) {
    return new FetchRequestBuilder(complianceCertificatesUrl, routeParams)
        .withQueryParam("filter", `certificateType eq '${type}'`)
        .fetchJson();
}

export function getComplianceDocuments(routeParams) {
    return new FetchRequestBuilder(complianceDocumentsUrl, routeParams)
        .fetchJson();
}

export function getComplianceDocument(routeParams, asPdf) {
    return new FetchRequestBuilder(complianceDocumentUrl, routeParams)
        .withQueryParam("asPdf", asPdf)
        .fetchJson();
}

export function uploadComplianceDocument(routeParams, document) {
    return new FetchRequestBuilder(complianceDocumentsUrl, routeParams)
        .withMethod("POST")
        .withBody(document)
        .fetch();
}

export function generateComplianceDocument(routeParams, reportRequest) {
    return new FetchRequestBuilder(generateComplianceDocumentUrl, routeParams)
        .withMethod("POST")
        .withBody(reportRequest)
        .fetch();
}

export function pingCompliance(routeParams) {
    return new FetchRequestBuilder(compliancePingUrl, routeParams).fetchJson();
}

export function checkInteroperabilityCompliance(routeParams, secondOperand) {
    return new FetchRequestBuilder(complianceCheckInteroperabilityUrl, routeParams)
        .withQueryParam("secondOperand", secondOperand)
        .fetchJson();
}

export function getSubmissions(routeParams) {
    return new FetchRequestBuilder(complianceSubmissionsUrl, routeParams)
        .withQueryParam("orderBy", "created desc")
        .withLocalization()
        .fetchJson();
}

export function getSubmission(routeParams) {
    return new FetchRequestBuilder(complianceSubmissionUrl, routeParams)
        .withLocalization()
        .fetchJson();
}

export function createSubmission(routeParams, isTestCase) {
    return new FetchRequestBuilder(complianceSubmissionsUrl, routeParams)
        .withMethod("POST")
        .withQueryParam("isTestCase", isTestCase)
        .withQueryParam("documentId", routeParams.documentId)
        .fetchJson();
}

export function getComplianceMessages(routeParams) {
    const submissionFilter = routeParams.submissionId ? `submissionId eq '${routeParams.submissionId}'` : null;
    return new FetchRequestBuilder(complianceMessagesUrl, routeParams)
        .withQueryParam("filter", submissionFilter)
        .withQueryParam("orderBy", "created desc")
        .withQueryParam("top", "7")
        .withLocalization()
        .fetchJson();
}
