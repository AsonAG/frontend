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

/**
 * Enum class RetroTimeType.
 * @enum {String}
 * @readonly
 */
const RetroTimeType = {
  /**
   * value: "Anytime"
   * @const
   */
  anytime: "Anytime",

  /**
   * value: "Cycle"
   * @const
   */
  cycle: "Cycle",

  /**
   * Returns a <code>RetroTimeType</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/RetroTimeType} The enum <code>RetroTimeType</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {RetroTimeType};