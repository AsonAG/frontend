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
import {ApiClient} from '../api/ApiClient';

/**
 * Enum class DayOfWeek.
 * @enum {String}
 * @readonly
 */
const DayOfWeek = {
  /**
   * value: "Sunday"
   * @const
   */
  sunday: "Sunday",

  /**
   * value: "Monday"
   * @const
   */
  monday: "Monday",

  /**
   * value: "Tuesday"
   * @const
   */
  tuesday: "Tuesday",

  /**
   * value: "Wednesday"
   * @const
   */
  wednesday: "Wednesday",

  /**
   * value: "Thursday"
   * @const
   */
  thursday: "Thursday",

  /**
   * value: "Friday"
   * @const
   */
  friday: "Friday",

  /**
   * value: "Saturday"
   * @const
   */
  saturday: "Saturday",

  /**
   * Returns a <code>DayOfWeek</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/DayOfWeek} The enum <code>DayOfWeek</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {DayOfWeek};