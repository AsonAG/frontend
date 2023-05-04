import { ApiClient } from "./ApiClient";

/**
 * Users service.
 * @module api/UsersApi
 * @version 1.0.11
 */
export class UsersApi {

  constructor(apiClient, tenantId) {
    this.apiClient = apiClient || ApiClient.instance;
    this.tenantId = tenantId;
  }

  /**
   * Gets a list of users.
   * @param {module:api/UsersApi~getCaseTasksCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
   */
  getUsers(callback, userIdentifier) {
    let postBody = null;

    // TODO: consider inactive users filter
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
      "/users",
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

export default UsersApi;
