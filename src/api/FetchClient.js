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

function appendQueryParams(url, queryParams) {
    if (queryParams) {
        const urlSearchParams = new URLSearchParams(queryParams);
        if (urlSearchParams.size > 0) {
            return `${url}?${new URLSearchParams(queryParams)}`;
        }
    }
    return url;
}


async function get(url, queryParams) {
    url = appendQueryParams(url, queryParams);
    return fetch(url, {method: "GET", ...defaultParams()});
}

async function post(url, body, queryParams) {
    url = appendQueryParams(url, queryParams);
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
    const response = await get(payrollUrl(tenantId, payrollId));
    return response.json();
}

function getEmployees(tenantId, payrollId) {
    return get(employeesUrl(tenantId));
}

function getEmployee(tenantId, employeeId) {
    return get(employeeUrl(tenantId, employeeId));
}

async function getEmployeeByIdentifier(tenantId, divisionId, identifier) {
    const response = await get(employeesUrl(tenantId), {divisionId, filter: `Identifier eq '${identifier}'`});
    const users = await response.json();
    return users?.length ? users[0] : null;
}

function getEmployeeCases(tenantId, payrollId, employeeId, clusterSetName) {
    return get(caseSetsUrl(tenantId, payrollId), {employeeId, clusterSetName, caseType: "Employee"});
}

// TODO AJO user id?
function getEmployeeCaseValues(tenantId, payrollId, employeeId, queryParams) {
    queryParams = queryParams ?? {};
    const url = `${payrollUrl(tenantId, payrollId)}/changes/values`;
    return get(url, {employeeId, caseType: "Employee", ...queryParams});
}

function getCompanyCases(tenantId, payrollId, clusterSetName) {
    return get(caseSetsUrl(tenantId, payrollId), {clusterSetName, caseType: "Company"});
}

function getCompanyCaseValues(tenantId, payrollId, queryParams) {
    queryParams = queryParams ?? {};
    const url = `${payrollUrl(tenantId, payrollId)}/changes/values`;
    return get(url, {caseType: "Company", ...queryParams});
}


function buildCase(tenantId, payrollId, caseName, caseChangeSetup, employeeId) {
    const queryParams = employeeId ? {employeeId} : {};
    const url = `${caseSetsUrl(tenantId, payrollId)}/${encodeURIComponent(caseName)}`;
    return post(url, caseChangeSetup, queryParams);
}
function addCase(tenantId, payrollId, caseChangeSetup, employeeId) {
    const queryParams = employeeId ? {employeeId} : {};
    return post(caseSetsUrl(tenantId, payrollId), caseChangeSetup, queryParams);
}

async function getUser(tenantId, identifier) {
    const response = await get(usersUrl(tenantId), {filter: `Identifier eq '${identifier}'`});
    const users = await response.json();
    return users?.length ? users[0] : null;
}

async function getLookupValues(tenantId, payrollId, lookupName) {
    return (await get(lookupValuesUrl(tenantId, payrollId), {lookupNames: lookupName})).json();
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