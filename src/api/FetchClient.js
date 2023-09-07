import getUser from '../auth/getUser';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl = `${baseUrl}/tenants`;

const tenantUrl = (tenantId) => `${tenantsUrl}/${tenantId}`;
const payrollsUrl = (tenantId) => `${tenantUrl(tenantId)}/payrolls`;
const payrollUrl = (tenantId, payrollId) => `${tenantUrl(tenantId)}/payrolls/${payrollId}`;
const caseSetsUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/cases/sets`;
const employeesUrl = (tenantId) => `${tenantUrl(tenantId)}/employees`;
const employeeUrl = (tenantId, employeeId) => `${employeesUrl(tenantId)}/${employeeId}`;


function defaultParams() {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${getUser()?.access_token}`);
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
    return fetch(url, {method: "POST", body: JSON.stringify(body), ...defaultParams()});
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

function getCase(tenantId, payrollId, caseName, employeeId) {
    const url = `${caseSetsUrl(tenantId, payrollId)}/${caseName}`;
    return get(url, {employeeId});
}

export { getTenants, getTenant, getPayrolls, getEmployees, getEmployee, getEmployeeCases, getEmployeeCaseValues, getCase };