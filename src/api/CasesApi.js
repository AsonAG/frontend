import { ApiClient } from "./ApiClient";
import { CaseDetails } from "../generated_model/CaseDetails";
import { CaseFieldBasic } from "../generated_model/CaseFieldBasic";
import { CasesArray } from "../generated_model/CasesArray";

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
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
  constructor(apiClient, user) {
    this.apiClient = apiClient || ApiClient.instance;

    this.tenantId = user.tenantId;
    this.userId = user.userId;
    // this.employeeId = user.employeeId;
    this.divisionId = user.currentDivisionId;
    this.payrollId = user.currentPayrollId;

    this.payrollPath = "/payrolls/" + this.payrollId + "/";
  }

  buildCaseFieldValues(caseName, caseFields) {
    return Object.keys(caseFields).map((id) => ({
      caseName: caseName,
      caseFieldName: caseFields[id].caseFieldName,
      value: caseFields[id].value,
      start: caseFields[id].start,
      end: caseFields[id].end,
      caseSlot: caseFields[id].caseSlot,
    }));
  }
  buildRequestBodyCaseBuild(caseName, caseFields) {
    return {
      case: {
        caseName: caseName,
        values: this.buildCaseFieldValues(caseName, caseFields[0]),

        relatedCases: caseFields[1].map((relatedCase, i) => ({
          caseName: relatedCase.caseName,
          values: this.buildCaseFieldValues(relatedCase.caseName, relatedCase),
        })),
      },
    };
  }
  // buildRequestBodyCaseSave(caseName, caseFields) {
  //   return {
  //     userId: this.userId,
  //     employeeId: this.employeeId,
  //     divisionId: this.divisionId,
  //     case: {
  //       caseName: caseName,
  //       values: this.buildCaseFieldValues(caseName, caseFields[0]),
  //       // relatedCases:
  //       //   JSON.stringify(caseFields[1]) != '{}' ? this.buildCaseFieldValues(caseName, caseFields[1]) : '[]',
  //     },
  //   };
  // }

  generateCasesBodyFromCasesObj(mainCase, relatedMainCases, shouldIncludeBody) {
    if (
      shouldIncludeBody
      // JSON.stringify(mainCase) != "{}"
    ) {
      // remove case name key
      let baseCase = JSON.parse(JSON.stringify(Object.values(mainCase)[0])); // TODO: remove cloning object later and move body creating logic to CaseForm
      let relatedCases = Object.values(relatedMainCases);
      let filteredRelatedCases = [];

      baseCase.values = JSON.parse(
        JSON.stringify(Object.values(Object.values(mainCase)[0].values))
      );

      relatedCases.map(
        (relatedCase) =>
          Object.values(relatedCase.values).forEach((field, i) => {
            // relatedCase.values[i] = Object.values(field)
            // if (Object.values(relatedCase.values).length > 0 )
            filteredRelatedCases.push(JSON.parse(JSON.stringify(field)));
          })
      );

      if (baseCase.values.length === 0) delete baseCase.values;

      // baseCase.relatedCases = filteredRelatedCases;
      baseCase.values = baseCase.values.concat(filteredRelatedCases);

      return {
        case: baseCase,
      };
    } else return null;
  }

  /**
   * Callback function to receive the result of the getCaseFields operation.
   * @callback moduleapi/CasesApi~getCaseFieldsCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CaseDetails{ data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Build a case and Get case fields
   * Returs case fields and values along with related cases fields and values. Running this request is required to build a case, before saving it with &#x60;cases/{caseName}/save&#x60;.
   * @param {String} caseName
   * @param {module:api/CasesApi~getCaseFieldsCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCaseFields(caseName, callback, baseCase, relatedCases, employeeId) {
    // verify the required parameter 'caseName' is set
    if (caseName === undefined || caseName === null) {
      throw new Error(
        "Missing the required parameter 'caseName' when calling getCaseFields"
      );
    }

    let shouldIncludeBody =
      JSON.stringify(baseCase) != "{}" &&
      JSON.stringify(Object.values(baseCase)[0]?.values) != "{}";
    // build a case body if case fields are provided
    // let postBody = caseFields.length > 0 ?
    let postBody = this.generateCasesBodyFromCasesObj(
      baseCase,
      relatedCases,
      shouldIncludeBody
    );

    console.log("Request body: " + JSON.stringify(postBody, null, 2));

    let pathParams = {
      caseName: caseName,
    };
    let queryParams = {
      userId: this.userId,
      employeeId: employeeId,
      // caseType: "Employee",
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
  saveCase(baseCase, relatedCases, callback, employeeId, opts) {
    opts = opts || {};
    // let postBody =
    //   JSON.stringify(caseFields[0]) != "{}"
    //     ? this.buildRequestBodyCaseSave(caseName, caseFields)
    //     : null;
    let postBody = this.generateCasesBodyFromCasesObj(
      baseCase,
      relatedCases,
      true
    );
    postBody.userId = this.userId;
    postBody.employeeId = employeeId;
    postBody.divisionId = this.divisionId;

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
      clusterSetName: clusterName
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
   * Callback function to receive the result of the getCaseFieldCurrentValues operation.
   * @callback moduleapi/CasesApi~getCaseFieldCurrentValuesCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CaseFieldBasic{ data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Gets case fields with their current values.
   * Returns case fields with their current values. Related cases and related case values are not returned.
   * @param {String} caseName
   * @param {module:api/CasesApi~getCaseFieldCurrentValuesCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCaseFieldCurrentValues(caseName, callback) {
    // TODO: Implement values logic
    let postBody = null;
    // verify the required parameter 'caseName' is set
    if (caseName === undefined || caseName === null) {
      throw new Error(
        "Missing the required parameter 'caseName' when calling getCaseFieldCurrentValues"
      );
    }

    let pathParams = {
      caseName: caseName,
    };
    let queryParams = {};
    let headerParams = {};
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CaseFieldBasic;

    return this.apiClient.callApi(
      this.payrollPath + "cases/{caseName}/currentValues",
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

