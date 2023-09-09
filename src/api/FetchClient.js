import getUser from '../auth/getUser';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl = `${baseUrl}/tenants`;

const tenantUrl = (tenantId) => `${tenantsUrl}/${tenantId}`;
const payrollsUrl = (tenantId) => `${tenantUrl(tenantId)}/payrolls`;
const payrollUrl = (tenantId, payrollId) => `${tenantUrl(tenantId)}/payrolls/${payrollId}`;
const caseSetsUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/cases/sets`;
const lookupValuesUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/lookups/values`;
const employeesUrl = (tenantId) => `${tenantUrl(tenantId)}/employees`;
const employeeUrl = (tenantId, employeeId) => `${employeesUrl(tenantId)}/${employeeId}`;


function defaultParams() {
    const headers = new Headers();
    if (import.meta.env.PROD) {
        headers.set('Authorization', `Bearer ${getUser()?.access_token}`);
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

function getTenant(tenantId) {
    return get(tenantUrl(tenantId));
}

function getPayrolls(tenantId) {
    return get(payrollsUrl(tenantId))
}

function getEmployees(tenantId, payrollId) {
    return get(employeesUrl(tenantId));
}

function getEmployee(tenantId, employeeId) {
    return get(employeeUrl(tenantId, employeeId));
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

function buildCase(tenantId, payrollId, caseName, employeeId, caseChangeSetup) {
    const url = `${caseSetsUrl(tenantId, payrollId)}/${encodeURIComponent(caseName)}`;
    return post(url, caseChangeSetup, {employeeId});
}

async function getLookupValues(tenantId, payrollId, lookupName) {
    return (await get(lookupValuesUrl(tenantId, payrollId), {lookupNames: lookupName})).json();
}

export { getTenants, getTenant, getPayrolls, getEmployees, getEmployee, getEmployeeCases, getEmployeeCaseValues, buildCase, getLookupValues };