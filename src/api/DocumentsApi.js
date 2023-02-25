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
import {DocumentStatus} from '../model/DocumentStatus';
import {DocumentsResponseBody} from '../model/DocumentsResponseBody';

/**
* Documents service.
* @module api/DocumentsApi
* @version 1.0.11
*/
export class DocumentsApi {

    /**
    * Constructs a new DocumentsApi. 
    * @alias module:api/DocumentsApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instanc
    e} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the getDocuments operation.
     * @callback moduleapi/DocumentsApi~getDocumentsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DocumentsResponseBody{ data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Gets a list of documents
     * Gets a list of documents. If the \&quot;taskStatus\&quot; parameter is left empty, all tasks are returned.
     * @param {Object} opts Optional parameters
     * @param {module:model/DocumentStatus} opts.documentStatus 
     * @param {module:api/DocumentsApi~getDocumentsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link <&vendorExtensions.x-jsdoc-type>}
     */
    getDocuments(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
        
      };
      let queryParams = {
        
      };
      let headerParams = {
        'documentStatus': opts['documentStatus']
      };
      let formParams = {
        
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = DocumentsResponseBody;

      return this.apiClient.callApi(
        '/documents', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}

export default DocumentsApi;