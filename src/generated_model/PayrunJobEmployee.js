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
import {ObjectStatus} from './ObjectStatus';

/**
 * The PayrunJobEmployee model module.
 * @module model/PayrunJobEmployee
 * @version 1
 */
export class PayrunJobEmployee {
  /**
   * Constructs a new <code>PayrunJobEmployee</code>.
   * The payrun job employee API object
   * @alias module:model/PayrunJobEmployee
   * @class
   * @param employeeId {Number} The employee id (immutable)
   */
  constructor(employeeId) {
    this.employeeId = employeeId;
  }

  /**
   * Constructs a <code>PayrunJobEmployee</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PayrunJobEmployee} obj Optional instance to populate.
   * @return {module:model/PayrunJobEmployee} The populated <code>PayrunJobEmployee</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new PayrunJobEmployee();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'Number');
      if (data.hasOwnProperty('status'))
        obj.status = ObjectStatus.constructFromObject(data['status']);
      if (data.hasOwnProperty('created'))
        obj.created = ApiClient.convertToType(data['created'], 'Date');
      if (data.hasOwnProperty('updated'))
        obj.updated = ApiClient.convertToType(data['updated'], 'Date');
      if (data.hasOwnProperty('employeeId'))
        obj.employeeId = ApiClient.convertToType(data['employeeId'], 'Number');
    }
    return obj;
  }
}

/**
 * The unique object id (immutable)
 * @member {Number} id
 */
PayrunJobEmployee.prototype.id = undefined;

/**
 * @member {module:model/ObjectStatus} status
 */
PayrunJobEmployee.prototype.status = undefined;

/**
 * The date which the API object was created (immutable)
 * @member {Date} created
 */
PayrunJobEmployee.prototype.created = undefined;

/**
 * The date which the API object was last updated (immutable)
 * @member {Date} updated
 */
PayrunJobEmployee.prototype.updated = undefined;

/**
 * The employee id (immutable)
 * @member {Number} employeeId
 */
PayrunJobEmployee.prototype.employeeId = undefined;

