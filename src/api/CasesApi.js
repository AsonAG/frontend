/*
 * Swagger Payroll API - OpenAPI 3.0
 * This is a base Payrolling API Gateway Server based on Ason Backend.  Some useful links: - [Ason portal](http://ason.ch/)
 *
 * OpenAPI spec version: 1.0.11
 * Contact: mikolaj.sienko@esgroup.ch
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.41
 *
 * Do not edit the class manually.
 *
 */
import {ApiClient} from "../ApiClient";
import {CaseDetails} from '../model/CaseDetails';
import {CaseFieldBasic} from '../model/CaseFieldBasic';
import {CasesArray} from '../model/CasesArray';

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
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the getCaseDropdownOptions operation.
     * @callback moduleapi/CasesApi~getCaseDropdownOptionsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CaseFieldBasic{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Gets case field dropdown options.
     * @param {String} caseName 
     * @param {module:api/CasesApi~getCaseDropdownOptionsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    getCaseDropdownOptions(caseName, callback) {
      
      let postBody = null;
      // verify the required parameter 'caseName' is set
      if (caseName === undefined || caseName === null) {
        throw new Error("Missing the required parameter 'caseName' when calling getCaseDropdownOptions");
      }

      let pathParams = {
        'caseName': caseName
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = CaseFieldBasic;

      return this.apiClient.callApi(
        '/cases/{caseName}/dropdowns', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
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
      
      let postBody = null;
      // verify the required parameter 'caseName' is set
      if (caseName === undefined || caseName === null) {
        throw new Error("Missing the required parameter 'caseName' when calling getCaseFieldCurrentValues");
      }

      let pathParams = {
        'caseName': caseName
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = CaseFieldBasic;

      return this.apiClient.callApi(
        '/cases/{caseName}/currentValues', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the getCaseFieldValueChanges operation.
     * @callback moduleapi/CasesApi~getCaseFieldValueChangesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CaseDetails{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Build a case and Get case fields values after changes
     * Returs case fields and values along with related cases fields and values. Running this request is required to build a case, before saving it with &#x60;cases/{caseName}/save&#x60;. This request also updates the values and related cases after provided user input as a POST request &#x60;body&#x60;.
     * @param {String} caseName 
     * @param {Object} opts Optional parameters
     * @param {module:model/CaseFieldBasic} opts.body 
     * @param {module:api/CasesApi~getCaseFieldValueChangesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    getCaseFieldValueChanges(caseName, opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];
      // verify the required parameter 'caseName' is set
      if (caseName === undefined || caseName === null) {
        throw new Error("Missing the required parameter 'caseName' when calling getCaseFieldValueChanges");
      }

      let pathParams = {
        'caseName': caseName
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = CaseDetails;

      return this.apiClient.callApi(
        '/cases/{caseName}', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
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
    getCaseFields(caseName, callback) {
      
      let postBody = null;
      // verify the required parameter 'caseName' is set
      if (caseName === undefined || caseName === null) {
        throw new Error("Missing the required parameter 'caseName' when calling getCaseFields");
      }

      let pathParams = {
        'caseName': caseName
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = CaseDetails;

      return this.apiClient.callApi(
        'cases/sets/{caseName}?userId=8&caseType=Employee&employeeId=51', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    getCaseFieldsMOCK(caseName, callback) {
      // MOCK - use only for development mock data. to use real api use above function implementation
      var data = null;
      console.log("MOCK casename: ", caseName);
      if (callback) {
        switch (caseName) {
          case "All Value Types":
            data = {"name":"All Value Types","fields":[{"name":"ExpressionString","description":null,"valueType":"String","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":10,"value":{"startDate":null,"endDate":null,"value":"Test expression string value"}},{"name":"LookupString","description":"Lookup string value available to choose from the options in the dropbox","valueType":"String","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":true,"order":20,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"LookupDecimal","description":null,"valueType":"Money","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":23,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"String","description":null,"valueType":"String","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":true,"order":30,"value":{"startDate":null,"endDate":null,"value":"100"}},{"name":"ReadOnlyString","description":null,"valueType":"String","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":32,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"MaskedString","description":null,"valueType":"String","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":35,"value":{"startDate":null,"endDate":null,"value":"Text value"}},{"name":"MultiLineString","description":null,"valueType":"String","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":40,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Date","description":null,"valueType":"Date","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":100,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"DateMonth","description":null,"valueType":"Date","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":105,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"DateTime","description":null,"valueType":"DateTime","timeType":"Timeless","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":110,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Integer","description":null,"valueType":"Integer","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":200,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Decimal","description":null,"valueType":"Decimal","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":300,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money","description":null,"valueType":"Money","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":310,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money CH","description":null,"valueType":"Money","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":314,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money DE","description":null,"valueType":"Money","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":315,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Percent","description":null,"valueType":"Percent","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":320,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Hour","description":null,"valueType":"Hour","timeType":"Timeless","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":330,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Day","description":null,"valueType":"Day","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":340,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Distance","description":null,"valueType":"Distance","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":350,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Boolean","description":null,"valueType":"Boolean","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":360,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"BooleanSwitch","description":null,"valueType":"Boolean","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":365,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"None","description":null,"valueType":"None","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":370,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":[{"name":"All Time Types","fields":[{"name":"Money.Period","description":null,"valueType":"Money","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.Time","description":null,"valueType":"Money","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.TimePeriod","description":null,"valueType":"Money","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.Timeless","description":null,"valueType":"Money","timeType":"Timeless","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":null}]};
            break;
          case "All Time Types":
            data = {"name":"All Time Types","fields":[{"name":"Money.Period","description":null,"valueType":"Money","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.Time","description":null,"valueType":"Money","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.TimePeriod","description":null,"valueType":"Money","timeType":"ScaledPeriod","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Money.Timeless","description":null,"valueType":"Money","timeType":"Timeless","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":null};
            break;
          case "Lohn":
            data = {"name":"Lohn","fields":[{"name":"Lohn","description":null,"valueType":"Money","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":[{"name":"Zulage","fields":[{"name":"Zulage","description":null,"valueType":"Money","timeType":"Moment","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":null}]};
            break;
          case "BaseCase":
            data = {"name":"BaseCase","fields":[{"name":"Base Case Field","description":null,"valueType":"String","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":null};
            break;
          case "BaseExtensionCase":
            data = {"name":"BaseExtensionCase","fields":[{"name":"Base Case Field","description":null,"valueType":"String","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}},{"name":"Extension Case Field","description":null,"valueType":"String","timeType":"Period","timeUnit":"Day","startDateType":"Day","endDateType":"Day","optional":false,"order":0,"value":{"startDate":null,"endDate":null,"value":null}}],"relatedCases":null};
            break;
          default:
            data = {"name":"ERROR"};
            break;
        }
      callback(null, data, null);
      }
    }


    /**
     * Callback function to receive the result of the getCases operation.
     * @callback moduleapi/CasesApi~getCasesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CasesArray{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all case types available for an employee.
     * @param {module:api/CasesApi~getCasesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    getCases(callback) {
      
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = CasesArray;

      return this.apiClient.callApi(
        '/cases', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the saveCase operation.
     * @callback moduleapi/CasesApi~saveCaseCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Save a new case
     * Saves a new case&#x27;s values along with it&#x27;s related cases. Before &#x60;/cases/{caseName}/save&#x60; send a build request using either POST or GET &#x60; /cases/{caseName}&#x60;.
     * @param {String} caseName 
     * @param {Object} opts Optional parameters
     * @param {module:model/CaseFieldBasic} opts.body 
     * @param {module:api/CasesApi~saveCaseCallback} callback The callback function, accepting three arguments: error, data, response
     */
    saveCase(caseName, opts, callback) {
      opts = opts || {};
      let postBody = opts['body'];
      // verify the required parameter 'caseName' is set
      if (caseName === undefined || caseName === null) {
        throw new Error("Missing the required parameter 'caseName' when calling saveCase");
      }

      let pathParams = {
        'caseName': caseName
      };
      let queryParams = {
        
      };
      let headerParams = {
        
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = [];
      let returnType = null;

      return this.apiClient.callApi(
        '/cases/{caseName}/save', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}

export default CasesApi;