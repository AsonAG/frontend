
import {ApiClient} from "./ApiClient";
import {Tenant} from '../generated_model/Tenant';

/**
* Tenants service.
* @module api/TenantsApi
* @version 1
*/
export class TenantsApi {

    /**
    * Constructs a new TenantsApi. 
    * @alias module:api/TenantsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the userTenants operation.
     * @callback moduleapi/TenantsApi~userTenantsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Tenant>{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/TenantsApi~userTenantsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    userTenants(callback) {
      
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
      let returnType = [Tenant];

      return this.apiClient.callApi(
        '', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}

export default TenantsApi;