/*
 * Ason Payroll Integration API v1
 * Integration API for the system provider [<a target=\"_blank\" href='https://ason.ch'>v0.3.0-pre-230213</a>]
 *
 * OpenAPI spec version: 1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.42
 *
 * Do not edit the class manually.
 *
 */
import {ApiClient} from '../ApiClient';
import {Language} from './Language';

/**
 * The ReportRequest model module.
 * @module model/ReportRequest
 * @version 1
 */
export class ReportRequest {
  /**
   * Constructs a new <code>ReportRequest</code>.
   * The report request API object
   * @alias module:model/ReportRequest
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ReportRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ReportRequest} obj Optional instance to populate.
   * @return {module:model/ReportRequest} The populated <code>ReportRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ReportRequest();
      if (data.hasOwnProperty('language'))
        obj.language = Language.constructFromObject(data['language']);
      if (data.hasOwnProperty('userId'))
        obj.userId = ApiClient.convertToType(data['userId'], 'Number');
      if (data.hasOwnProperty('parameters'))
        obj.parameters = ApiClient.convertToType(data['parameters'], {'String': 'String'});
    }
    return obj;
  }
}

/**
 * @member {module:model/Language} language
 */
ReportRequest.prototype.language = undefined;

/**
 * The report user
 * @member {Number} userId
 */
ReportRequest.prototype.userId = undefined;

/**
 * The report parameters
 * @member {Object.<String, String>} parameters
 */
ReportRequest.prototype.parameters = undefined;

