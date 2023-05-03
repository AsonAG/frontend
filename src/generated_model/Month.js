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
 * Enum class Month.
 * @enum {String}
 * @readonly
 */
const Month = {
  /**
   * value: "NotSet"
   * @const
   */
  notSet: "NotSet",

  /**
   * value: "January"
   * @const
   */
  january: "January",

  /**
   * value: "February"
   * @const
   */
  february: "February",

  /**
   * value: "March"
   * @const
   */
  march: "March",

  /**
   * value: "April"
   * @const
   */
  april: "April",

  /**
   * value: "May"
   * @const
   */
  may: "May",

  /**
   * value: "June"
   * @const
   */
  june: "June",

  /**
   * value: "July"
   * @const
   */
  july: "July",

  /**
   * value: "August"
   * @const
   */
  august: "August",

  /**
   * value: "September"
   * @const
   */
  september: "September",

  /**
   * value: "October"
   * @const
   */
  october: "October",

  /**
   * value: "November"
   * @const
   */
  november: "November",

  /**
   * value: "December"
   * @const
   */
  december: "December",

  /**
   * Returns a <code>Month</code> enum value from a JavaScript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/Month} The enum <code>Month</code> value.
   */
  constructFromObject: function(object) {
    return object;
  }
};

export {Month};