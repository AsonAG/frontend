import getAuthUser from '../auth/getUser';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const tenantsUrl = `${baseUrl}/tenants`;

const tenantUrl = (tenantId) => `${tenantsUrl}/${tenantId}`;
const payrollsUrl = (tenantId) => `${tenantUrl(tenantId)}/payrolls`;
const payrollUrl = (tenantId, payrollId) => `${tenantUrl(tenantId)}/payrolls/${payrollId}`;
const caseSetsUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/cases/sets`;
const lookupValuesUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/lookups/values`;
const employeesUrl = (tenantId) => `${tenantUrl(tenantId)}/employees`;
const payrollEmployeesUrl = (tenantId, payrollId) => `${payrollUrl(tenantId, payrollId)}/employees`;
const employeeUrl = (tenantId, employeeId) => `${employeesUrl(tenantId)}/${employeeId}`;
const usersUrl = (tenantId) => `${tenantUrl(tenantId)}/users`;
const employeeDocumentUrl = (tenantId, employeeId, caseValueId, documentId) => `${employeeUrl(tenantId, employeeId)}/cases/${caseValueId}/documents/${documentId}`;
const companyDocumentUrl = (tenantId, caseValueId, documentId) => `${tenantUrl(tenantId)}/companycases/${caseValueId}/documents/${documentId}`;

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
          getTenant(tenantId),
          getUser(tenantId, authUserEmail),
          getPayrolls(tenantId)
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

    constructor(url) {
        this.url = url;

        if (import.meta.env.PROD) {
            this.headers.set('Authorization', `Bearer ${getAuthUser()?.access_token}`);
        }
        this.headers.set('Accept', 'application/json');
        this.headers.set('Content-Type', 'application/json');
    }

    withUrl(url) {
        this.url = url;
        return this;
    }

    withMethod(method) {
        this.method = method;
        return this;
    }

    withLocalization(tenantId) {
        this.localizeRequest = true;
        this.tenantId = tenantId;
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

    async fetch() {
        if (!this.url) {
            throw new Error("Url cannot be empty");
        }
        if (this.localizeRequest && this.tenantId) {
            const data = await tenantDataCache.getData(this.tenantId);
            this.searchParams.append("language", data.user.language);
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

export function getTenant(tenantId) {
    return new FetchRequestBuilder(tenantUrl(tenantId)).fetchJson();
}

export function getPayrolls(tenantId) {
    return new FetchRequestBuilder(payrollsUrl(tenantId)).fetchJson();
}

export function getPayroll(tenantId, payrollId) {
    return new FetchRequestBuilder(payrollUrl(tenantId, payrollId)).fetchJson();
}

export function getEmployees(tenantId, payrollId) {
    return new FetchRequestBuilder(payrollEmployeesUrl(tenantId, payrollId)).fetch();
}

export async function getEmployee(tenantId, employeeId) {
    return new FetchRequestBuilder(employeeUrl(tenantId, employeeId)).fetchJson();
}

export async function getEmployeeByIdentifier(tenantId, payrollId, identifier) {
    const employees = await new FetchRequestBuilder()
        .withUrl(payrollEmployeesUrl(tenantId, payrollId))
        .withQueryParam("filter", `Identifier eq '${identifier}'`)
        .fetchJson();
    return employees?.length ? employees[0] : null;
}

export function getEmployeeCases(tenantId, payrollId, employeeId, clusterSetName) {
    return new FetchRequestBuilder()
        .withUrl(caseSetsUrl(tenantId, payrollId))
        .withQueryParam("employeeId", employeeId)
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Employee")
        .withLocalization(tenantId)
        .fetch();
}

// TODO AJO user id?
export function getEmployeeCaseValues(tenantId, payrollId, employeeId, filter) {
    return new FetchRequestBuilder()
        .withUrl(`${payrollUrl(tenantId, payrollId)}/changes/values`)
        .withQueryParam("employeeId", employeeId)
        .withQueryParam("caseType", "Employee")
        .withQueryParam("filter", filter)
        .withLocalization(tenantId)
        .fetch();
}

export function getCompanyCases(tenantId, payrollId, clusterSetName) {
    return new FetchRequestBuilder()
        .withUrl(caseSetsUrl(tenantId, payrollId))
        .withQueryParam("clusterSetName", clusterSetName)
        .withQueryParam("caseType", "Company")
        .withLocalization(tenantId)
        .fetch();
}

export function getCompanyCaseValues(tenantId, payrollId, filter) {
    return new FetchRequestBuilder()
        .withUrl(`${payrollUrl(tenantId, payrollId)}/changes/values`)
        .withQueryParam("caseType", "Company")
        .withQueryParam("filter", filter)
        .withLocalization(tenantId)
        .fetch();
}

export function buildCase(tenantId, payrollId, caseName, caseChangeSetup, employeeId) {
    return new FetchRequestBuilder()
        .withUrl(`${caseSetsUrl(tenantId, payrollId)}/${encodeURIComponent(caseName)}`)
        .withMethod("POST")
        .withBody(caseChangeSetup)
        .withQueryParam("employeeId", employeeId)
        .withLocalization(tenantId)
        .fetch();
}

export function addCase(tenantId, payrollId, caseChangeSetup, employeeId) {
    return new FetchRequestBuilder()
        .withUrl(caseSetsUrl(tenantId, payrollId))
        .withMethod("POST")
        .withBody(caseChangeSetup)
        .withQueryParam("employeeId", employeeId)
        .withLocalization(tenantId)
        .fetch();
}

export async function getUser(tenantId, identifier) {
    const users = await new FetchRequestBuilder()
        .withUrl(usersUrl(tenantId))
        .withQueryParam("filter", `Identifier eq '${identifier}'`)
        .fetchJson();
    const user = users?.length ? users[0] : null;
    return user;
}

export function getLookupValues(tenantId, payrollId, lookupName) {
    return new FetchRequestBuilder()
        .withUrl(lookupValuesUrl(tenantId, payrollId))
        .withQueryParam("lookupNames", lookupName)
        .withLocalization(tenantId)
        .fetchJson();
}

export function getDocument(tenantId, caseValueId, documentId, employeeId) {
    const url = employeeId ? 
        employeeDocumentUrl(tenantId, employeeId, caseValueId, documentId) :
        companyDocumentUrl(tenantId, caseValueId, documentId);

    return new FetchRequestBuilder(url).fetchJson();
}