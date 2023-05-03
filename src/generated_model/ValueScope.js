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
 * Enum class ValueScope.
 * @enum {String}
 * @readonly
 */
const ValueScope = {
  /**
   * value: "Local"
   * @const
   */
  local: "Local",

  /**
   * value: "Global"
   * @const
   */
  global: "Global",

  /**
   * Returns a <code>ValueScope</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/ValueScope} The enum <code>ValueScope</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {ValueScope};