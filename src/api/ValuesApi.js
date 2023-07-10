import { ApiClient } from "./ApiClient";
import { CaseDetails } from "../generated_model/CaseDetails";
import { CaseFieldBasic } from "../generated_model/CaseFieldBasic";
import { CasesArray } from "../generated_model/CasesArray";
import cloneDeep from "lodash/cloneDeep";

/**
 * Cases service.
 * @module api/CasesApi
 * @version 1.0.11
 */
export class CasesApi {
  /**
   * Constructs a new CasesApi.
   * @alias module:api/CasesApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  constructor(apiClient, user) {
    this.apiClient = apiClient || ApiClient.instance;

    this.tenantId = user.tenantId;
    this.divisionId = user.currentDivisionId;
  }

  getCaseValues(callback, caseType, employeeId) {
    let path =
      caseType === "Company" ? "companycases" : "employees/{employeeId}/cases";

    let postBody = null;

    let pathParams = { employeeId };
    let queryParams =  { divisionId: this.divisionId } ;
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = null;

    return this.apiClient.callApi(
      path,
      "GET",
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      callback,
      this.tenantId
    );
  }
}

export default CasesApi;
