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
import {ApiClient} from '../api/ApiClient';

/**
 * Enum class CaseFieldTimeUnit.
 * @enum {String}
 * @readonly
 */
const CaseFieldTimeUnit = {
  /**
   * value: "Day"
   * @const
   */
  day: "Day",

  /**
   * value: "HalfDay"
   * @const
   */
  halfDay: "HalfDay",

  /**
   * value: "Month"
   * @const
   */
  month: "Month",

  /**
   * Returns a <code>CaseFieldTimeUnit</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/CaseFieldTimeUnit} The enum <code>CaseFieldTimeUnit</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {CaseFieldTimeUnit};