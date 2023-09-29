import { generatePath } from 'react-router-dom';
import getAuthUser from '../auth/getUser';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl          = "/tenants";
const tenantUrl           = "/tenants/:tenantId";
const payrollsUrl         = "/tenants/:tenantId/payrolls";
const payrollUrl          = "/tenants/:tenantId/payrolls/:payrollId";
const caseSetsUrl         = "/tenants/:tenantId/payrolls/:payrollId/cases/sets";
const caseSetUrl          = "/tenants/:tenantId/payrolls/:payrollId/cases/sets/:caseName";
const lookupValuesUrl     = "/tenants/:tenantId/payrolls/:payrollId/lookups/values";
const payrollEmployeesUrl = "/tenants/:tenantId/payrolls/:payrollId/employees";
const employeeUrl         = "/tenants/:tenantId/employees/:employeeId";
const usersUrl            = "/tenants/:tenantId/users";
const employeeDocumentUrl = "/tenants/:tenantId/employees/:employeeId/cases/:caseValueId/documents/:documentId";
const companyDocumentUrl  = "/tenants/:tenantId/companycases/:caseValueId/documents/:documentId";

class TenantDataCache {
    tenantDataCache = {};

    async getData(tenantId) {
        let data = this.tenantDataCache[tenantId];
  
        if (!data) {
            data = this.tenantDataCache[tenantId] = this.loadTenantData(tenantId);
        }
        
        const [tenant, user, payrolls] = await data;

        return {tenant, user, payrolls};
    }

    loadTenantData(tenantId) {
        const authUserEmail = getAuthUser()?.profile.email;
        return Promise.all([
          getTenant({tenantId}),
          getUser({tenantId}, authUserEmail),
          getPayrolls({tenantId})
        ]);
    }
}

export const tenantDataCache = new TenantDataCache();

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

    constructor(url, routeParams) {
        if (!url) {
            throw new Error("Url cannot be empty");
        }
        this.url = baseUrl + generatePath(url, routeParams);
        this.routeParams = routeParams || {};

        if (import.meta.env.PROD) {
            this.headers.set('Authorization', `Bearer ${getAuthUser()?.access_token}`);
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
            this.searchParams.append(key, value);
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

    async fetch() {
        if (this.routeParams.tenantId) {
            if (this.localizeRequest) {
                const data = await tenantDataCache.getData(this.routeParams.tenantId);
                this.searchParams.append("language", data.user.language);
            }
            if (this.addUserQueryParam) {
                const data = await tenantDataCache.getData(this.routeParams.tenantId);
                this.searchParams.append("userId", data.user.id);
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

export function getEmployees(routeParams) {
    return new FetchRequestBuilder(payrollEmployeesUrl, routeParams).fetch();
}

export async function getEmployee(routeParams) {
    return new FetchRequestBuilder(employeeUrl, routeParams).fetchJson();
}

export async function getEmployeeByIdentifier(routeParams, identifier) {
    const employees = await new FetchRequestBuilder(payrollEmployeesUrl, routeParams)
        .withQueryParam("filter", `Identifier eq '${identifier}'`)
        .fetchJson();
    return employees?.length ? employees[0] : null;
}

export function getEmployeeCases(routeParams, clusterSetName) {
    return new FetchRequestBuilder(caseSetsUrl, routeParams)
        .withQueryParam("employeeId", routeParams.employeeId)
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Employee")
        .withLocalization()
        .withUser()
        .fetch();
}

export function getEmployeeCaseValues(routeParams, filter) {
    const url = payrollUrl + "/changes/values";
    return new FetchRequestBuilder(url, routeParams)
        .withQueryParam("employeeId", routeParams.employeeId)
        .withQueryParam("caseType", "Employee")
        .withQueryParam("filter", filter)
        .withLocalization()
        .withUser()
        .fetch();
}

export function getCompanyCases(routeParams, clusterSetName) {
    return new FetchRequestBuilder(caseSetsUrl, routeParams)
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Company")
        .withLocalization()
        .withUser()
        .fetch();
}

export function getCompanyCaseValues(routeParams, filter) {
    const url = payrollUrl + "/changes/values";
    return new FetchRequestBuilder(url, routeParams)
        .withQueryParam("caseType", "Company")
        .withQueryParam("filter", filter)
        .withLocalization()
        .withUser()
        .fetch();
}

export function buildCase(routeParams, caseChangeSetup) {
    return new FetchRequestBuilder(caseSetUrl, routeParams)
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

export function getDocument(routeParams) {
    const url = routeParams.employeeId ? 
        employeeDocumentUrl :
        companyDocumentUrl;

    return new FetchRequestBuilder(url, routeParams).fetchJson();
}