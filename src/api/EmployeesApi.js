import { ApiClient } from "./ApiClient";

/**
 * Tasks service.
 * @module api/EmployeesApi
 * @version 1.0.11
 */
export class EmployeesApi {
  /**
    * Constructs a new EmployeesApi. 
    * @alias module:api/EmployeesApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
  constructor(apiClient, user) {
    this.apiClient = apiClient || ApiClient.instance;
    this.tenantId = user.tenantId;
    // this.userId = user.userId;
    // this.employeeId = user.employeeId;
  }

  /**
   * Callback function to receive the result of the getCaseTasks operation.
   * @callback moduleapi/EmployeesApi~getCaseTasksCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CasesArray{ data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Gets a list of tasks
   * Gets a list of employee tasks.
   * @param {module:api/EmployeesApi~getCaseTasksCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getEmployees(callback) {
    let postBody = null;

    let pathParams = {};
    let queryParams = {
    };
    let headerParams = {
    };
    let formParams = {};

    let authNames = [];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = null;

    return this.apiClient.callApi(
      "employees",
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

export default EmployeesApi;
