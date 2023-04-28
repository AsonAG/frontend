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
import {IntPtr} from './IntPtr';

/**
 * The RuntimeMethodHandle model module.
 * @module model/RuntimeMethodHandle
 * @version 1
 */
export class RuntimeMethodHandle {
  /**
   * Constructs a new <code>RuntimeMethodHandle</code>.
   * @alias module:model/RuntimeMethodHandle
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>RuntimeMethodHandle</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RuntimeMethodHandle} obj Optional instance to populate.
   * @return {module:model/RuntimeMethodHandle} The populated <code>RuntimeMethodHandle</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new RuntimeMethodHandle();
      if (data.hasOwnProperty('value'))
        obj.value = IntPtr.constructFromObject(data['value']);
    }
    return obj;
  }
}

/**
 * @member {module:model/IntPtr} value
 */
RuntimeMethodHandle.prototype.value = undefined;

