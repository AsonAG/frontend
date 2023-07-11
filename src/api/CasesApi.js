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
    this.userId = user.userId;
    // this.employeeId = user.employeeId;
    this.divisionId = user.currentDivisionId;
    this.payrollId = user.currentPayrollId;

    this.payrollPath = "/payrolls/" + this.payrollId + "/";

    this.userLanguage = user.language;
  }

  buildCasesBody(
    outputCaseMap,
    shouldIncludeBody,
    shouldDeleteDocumentsFromBody
  ) {
    if (shouldIncludeBody) {
      let outputCase = {};
      let baseCase = getMainCaseObject(outputCaseMap);

      outputCase.caseName = baseCase.caseName;
      outputCase.values = Object.values(baseCase.values);
      outputCase.relatedCases = this.buildRelatedCasesBody(
        baseCase.relatedCases
      );

      // delete empty items
      if (outputCase.values.length === 0) delete outputCase.values;

      return {
        case: outputCase,
      };
    } else return null;
  }

  buildRelatedCasesBody(relatedCases, shouldDeleteDocumentsFromBody) {
    let filteredRelatedCases = [];

    Object.values(relatedCases).map((relatedCase) => {
      let caseObj = {};
      caseObj.caseName = relatedCase.caseName;
      caseObj.values = Object.values(relatedCase.values);
      caseObj.relatedCases = this.buildRelatedCasesBody(
        relatedCase.relatedCases
      );
      filteredRelatedCases.push(caseObj);
    });

    return filteredRelatedCases;
  }

  // filter values and related cases (if they are in inputCase or not)
  filterBody(inputCaseSchema, outputCase) {
    // fields filter
    let valuesSchema = inputCaseSchema.fields.map((field) => field.name);
    outputCase.values = outputCase.values.filter((val) =>
      valuesSchema.includes(val.caseFieldName)
    );
    // related cases filter
    let relatedCasesSchema = inputCaseSchema.relatedCases.map(
      (relCase) => relCase.name
    );
    outputCase.relatedCases = outputCase.relatedCases.filter((rel) =>
      relatedCasesSchema.includes(rel.caseName)
    );
    // related cases values filter
    inputCaseSchema.relatedCases?.forEach((relSchema) => {
      let relatedCase = outputCase.relatedCases.find(
        (rel) => rel.caseName === relSchema.name
      );
      relatedCase && this.filterBody(relSchema, relatedCase);
    });
  }

  /**
   * Build a case and Get case fields
   * Returs case fields and values along with related cases fields and values. Running this request is required to build a case, before saving it with &#x60;cases/{caseName}/save&#x60;.
   * @param {String} caseName
   * @param {module:api/CasesApi~getCaseFieldsCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCaseFields(caseName, inputCase, outputCase, callback, employeeId) {
    // verify the required parameter 'caseName' is set
    if (caseName === undefined || caseName === null) {
      throw new Error(
        "Missing the required parameter 'caseName' when calling getCaseFields"
      );
    }

    let shouldIncludeBody =
      Object.values(outputCase).length > 0 &&
      Object.values(getMainCaseObject(outputCase)?.values).length > 0;
    // build a case body if case fields are provided
    let postBody = this.buildCasesBody(outputCase, shouldIncludeBody, true);

    if (shouldIncludeBody) this.filterBody(inputCase, postBody.case);
    console.log("Request body: " + JSON.stringify(postBody, null, 2));

    let pathParams = {
      caseName: caseName,
    };
    let queryParams = {
      userId: this.userId,
      employeeId: employeeId,
      // caseType: "Employee",
      language: this.userLanguage,
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CaseDetails;

    return this.apiClient.callApi(
      this.payrollPath + "cases/sets/{caseName}",
      "POST",
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

  /**
   * Save a new case
   * Saves a new case&#x27;s values along with it&#x27;s related cases. Before &#x60;/cases/{caseName}/save&#x60; send a build request using either POST or GET &#x60; /cases/{caseName}&#x60;.
   * @param {String} caseName
   * @param {Object} opts Optional parameters
   * @param {module:model/CaseFieldBasic} opts.body
   * @param {module:api/CasesApi~saveCaseCallback} callback The callback function, accepting three arguments: error, data, response
   */
  saveCase(inputCase, outputCase, callback, employeeId, opts) {
    opts = opts || {};
    // let postBody =
    //   JSON.stringify(caseFields[0]) != "{}"
    //     ? this.buildRequestBodyCaseSave(caseName, caseFields)
    //     : null;
    let postBody = this.buildCasesBody(outputCase, true);
    postBody.userId = this.userId;
    postBody.employeeId = employeeId;
    postBody.divisionId = this.divisionId;

    this.filterBody(inputCase, postBody.case);
    console.log("Request body: " + JSON.stringify(postBody, null, 2));

    let pathParams = {};
    let queryParams = {
      // userId: this.userId,
      // employeeId: employeeId ? employeeId : this.employeeId,
      // caseType: "Employee",
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = ["application/json"];
    let accepts = [];
    let returnType = null;

    return this.apiClient.callApi(
      this.payrollPath + "cases/sets",
      "POST",
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

  /**
   * Get all case types available for an employee.
   * @param {module:api/CasesApi~getCasesCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCases(callback, caseType, employeeId, clusterName) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      userId: this.userId,
      employeeId: employeeId,
      caseType: caseType,
      clusterSetName: clusterName,
      language: this.userLanguage,
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CasesArray;

    return this.apiClient.callApi(
      this.payrollPath + "cases/sets",
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

  getCaseValues(callback, caseType, employeeId, clusterName) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      userId: this.userId,
      employeeId: employeeId,
      divisionId: this.divisionId,
      caseType: caseType,
      clusterSetName: clusterName, // TODO: specific cluster for ESS docs
      language: this.userLanguage,
      filter: "DocumentCount gt 0",
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = null;

    return this.apiClient.callApi(
      this.payrollPath + "changes/values",
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

  /**
   * Gets case field dropdown options.
   * @param {String} caseName
   * @param {module:api/CasesApi~getCaseDropdownOptionsCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCaseFieldLookups(lookupName, callback) {
    let postBody = null;
    // verify the required parameter 'lookupName' is set
    if (lookupName === undefined || lookupName === null) {
      throw new Error(
        "Missing the required parameter 'lookupName' when calling getCaseLookups"
      );
    }

    let pathParams = {};
    let queryParams = {
      lookupNames: lookupName,
      language: this.userLanguage,
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CaseFieldBasic;

    return this.apiClient.callApi(
      this.payrollPath + "lookups/values",
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

  /**
   * Gets case fields with their current values.
   * Returns case fields with their current values. Related cases and related case values are not returned.
   * @param {String} caseName
   * @param {module:api/CasesApi~getCaseFieldCurrentValuesCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCurrentCaseValues(callback, caseType, employeeId, clusterName) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      userId: this.userId,
      employeeId,
      caseType,
      clusterSetName: clusterName,
      language: this.userLanguage,
    };
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CasesArray;

    return this.apiClient.callApi(
      this.payrollPath + "cases/values/time",
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

export function getMainCaseObject(mainCase) {
  return Object.values(mainCase)[0];
}

export default CasesApi;
