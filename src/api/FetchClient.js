import getAuthUser from '../auth/getUser';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl = `${baseUrl}/tenants`;

const tenantUrl = (tenantId) => `${tenantsUrl}/${tenantId}`;
const payrollsUrl = (tenantId) => `${tenantUrl(tenantId)}/payrolls`;
const payrollUrl = (tenantId, payrollId) => `${tenantUrl(tenantId)}/payrolls/${payrollId}`;
const caseSetsUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/cases/sets`;
const lookupValuesUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/lookups/values`;
const employeesUrl = (tenantId) => `${tenantUrl(tenantId)}/employees`;
const employeeUrl = (tenantId, employeeId) => `${employeesUrl(tenantId)}/${employeeId}`;
const usersUrl = (tenantId) => `${tenantUrl(tenantId)}/users`;
const employeeDocumentUrl = (tenantId, employeeId, caseValueId, documentId) => `${employeeUrl(tenantId, employeeId)}/cases/${caseValueId}/documents/${documentId}`;
const companyDocumentUrl = (tenantId, caseValueId, documentId) => `${tenantUrl(tenantId)}/companycases/${caseValueId}/documents/${documentId}`;

function defaultParams() {
    const headers = new Headers();
    if (import.meta.env.PROD) {
        headers.set('Authorization', `Bearer ${getAuthUser()?.access_token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return { headers, signal: AbortSignal.timeout(60000) };
}

function appendSearchParams(url, searchParams) {
    if (searchParams && searchParams.size > 0) {
        return `${url}?${new URLSearchParams(searchParams)}`;
    }
    return url;
}


async function get(url, searchParams) {
    url = appendSearchParams(url, searchParams);
    return fetch(url, {method: "GET", ...defaultParams()});
}

async function post(url, body, searchParams) {
    url = appendSearchParams(url, searchParams);
    let fetchParams = {
        method: "POST",
        ...defaultParams()
    };

    if (body) {
        fetchParams = {...fetchParams, body: JSON.stringify(body)};
    }

    return fetch(url, fetchParams);
}

function getTenants() {
    return get(tenantsUrl);
}

async function getTenant(tenantId) {
    return (await get(tenantUrl(tenantId))).json();
}

async function getPayrolls(tenantId) {
    return (await get(payrollsUrl(tenantId))).json();
}

async function getPayroll(tenantId, payrollId) {
    return (await get(payrollUrl(tenantId, payrollId))).json();
}

function getEmployees(tenantId, payrollId) {
    return get(employeesUrl(tenantId));
}

async function getEmployee(tenantId, employeeId) {
    return (await get(employeeUrl(tenantId, employeeId))).json();
}

async function getEmployeeByIdentifier(tenantId, divisionId, identifier) {
    const searchParams = new URLSearchParams();
    searchParams.append("divisionId", divisionId);
    searchParams.append("filter", `Identifier eq '${identifier}'`);
    const response = await get(employeesUrl(tenantId), searchParams);
    const users = await response.json();
    return users?.length ? users[0] : null;
}

function getEmployeeCases(tenantId, payrollId, employeeId, clusterSetName) {
    const searchParams = new URLSearchParams();
    searchParams.append("employeeId", employeeId);
    searchParams.append("clusterSetName", clusterSetName);
    searchParams.append("caseType", "Employee");
    return get(caseSetsUrl(tenantId, payrollId), searchParams);
}

// TODO AJO user id?
function getEmployeeCaseValues(tenantId, payrollId, employeeId, filter) {
    const searchParams = new URLSearchParams();
    searchParams.append("employeeId", employeeId);
    searchParams.append("caseType", "Employee");
    if (filter) {
        searchParams.append("filter", filter);
    }
    const url = `${payrollUrl(tenantId, payrollId)}/changes/values`;
    return get(url, searchParams);
}

function getCompanyCases(tenantId, payrollId, clusterSetName) {
    const searchParams = new URLSearchParams();
    searchParams.append("caseType", "Company");
    searchParams.append("clusterSetName", clusterSetName);
    return get(caseSetsUrl(tenantId, payrollId), searchParams);
}

function getCompanyCaseValues(tenantId, payrollId, filter) {
    const searchParams = new URLSearchParams();
    searchParams.append("caseType", "Company");
    if (filter) {
        searchParams.append("filter", filter);
    }
    const url = `${payrollUrl(tenantId, payrollId)}/changes/values`;
    return get(url, searchParams);
}


function buildCase(tenantId, payrollId, caseName, caseChangeSetup, employeeId) {
    const searchParams = new URLSearchParams();
    if (employeeId) {
        searchParams.append("employeeId", employeeId);
    }
    const url = `${caseSetsUrl(tenantId, payrollId)}/${encodeURIComponent(caseName)}`;
    return post(url, caseChangeSetup, searchParams);
}
function addCase(tenantId, payrollId, caseChangeSetup, employeeId) {
    const searchParams = new URLSearchParams();
    if (employeeId) {
        searchParams.append("employeeId", employeeId);
    }
    return post(caseSetsUrl(tenantId, payrollId), caseChangeSetup, searchParams);
}

async function getUser(tenantId, identifier) {
    const searchParams = new URLSearchParams();
    searchParams.append("filter", `Identifier eq '${identifier}'`);
    const response = await get(usersUrl(tenantId), searchParams);
    const users = await response.json();
    return users?.length ? users[0] : null;
}

async function getLookupValues(tenantId, payrollId, lookupName) {
    const searchParams = new URLSearchParams();
    searchParams.append("lookupNames", lookupName);
    return (await get(lookupValuesUrl(tenantId, payrollId), searchParams)).json();
}

async function getDocument(tenantId, caseValueId, documentId, employeeId) {
    const url = employeeId ? 
        employeeDocumentUrl(tenantId, employeeId, caseValueId, documentId) :
        companyDocumentUrl(tenantId, caseValueId, documentId);

    return (await get(url)).json();
}

export { 
    getTenants,
    getTenant,
    getPayrolls,
    getEmployees,
    getEmployee,
    getEmployeeByIdentifier,
    getEmployeeCases,
    getEmployeeCaseValues,
    getCompanyCases,
    getCompanyCaseValues,
    buildCase,
    addCase,
    getLookupValues,
    getUser,
    getPayroll,
    getDocument
};