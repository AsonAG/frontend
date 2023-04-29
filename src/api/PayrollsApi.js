import { ApiClient } from "./ApiClient";

/**
 * Payrolls service.
 * @module api/PayrollsApi
 * @version 1.0.11
 */
export class PayrollsApi {

  constructor(apiClient, tenantId) {
    this.apiClient = apiClient || ApiClient.instance;
    this.tenantId = tenantId;
  }

  /**
   * Gets a list of payrolls.
   * @param {module:api/PayrollsApi~getCaseTasksCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getPayrolls(callback) {
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
      "payrolls",
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

export default PayrollsApi;
