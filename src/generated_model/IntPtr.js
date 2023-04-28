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

/**
 * The IntPtr model module.
 * @module model/IntPtr
 * @version 1
 */
export class IntPtr {
  /**
   * Constructs a new <code>IntPtr</code>.
   * @alias module:model/IntPtr
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>IntPtr</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IntPtr} obj Optional instance to populate.
   * @return {module:model/IntPtr} The populated <code>IntPtr</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new IntPtr();
    }
    return obj;
  }
}
