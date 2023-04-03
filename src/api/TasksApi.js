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
import { ApiClient } from "../ApiClient";
import { CasesArray } from "../generated_model/CasesArray";

/**
 * Tasks service.
 * @module api/TasksApi
 * @version 1.0.11
 */
export class TasksApi {
  /**
    * Constructs a new TasksApi. 
    * @alias module:api/TasksApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;
    this.userId = this.apiClient.userId;
    this.employeeId = this.apiClient.employeeId;
  }

  /**
   * Callback function to receive the result of the getCaseTasks operation.
   * @callback moduleapi/TasksApi~getCaseTasksCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CasesArray{ data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Gets a list of tasks
   * Gets a list of employee tasks.
   * @param {module:api/TasksApi~getCaseTasksCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getCaseTasksFromCluster(callback, caseType, clusterName) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {
      userId: this.userId,
      employeeId: this.employeeId,
      caseType: caseType,
      clusterSetName: clusterName
    };
    let headerParams = {
    };
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = CasesArray;

    return this.apiClient.callApi(
      "cases/sets", // TODO: change payroll path 
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
      callback
    );
  }
  getCaseTasksMOCK(callback) {
    // MOCK - use only for development mock data. to use real api use above function implementation
    var data = null;
    if (callback) {
      data = [{"name":"All Value Types"},{"name":"All Time Types"},{"name":"Lohn"},{"name":"BaseCase"},{"name":"BaseExtensionCase"}];
    }
    callback(null, data, null);
  }
}

export default TasksApi;
