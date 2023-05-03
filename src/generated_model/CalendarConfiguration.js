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
import {CalendarCalculationMode} from './CalendarCalculationMode';
import {CalendarWeekRule} from './CalendarWeekRule';
import {DayOfWeek} from './DayOfWeek';
import {Month} from './Month';

/**
 * The CalendarConfiguration model module.
 * @module model/CalendarConfiguration
 * @version 1
 */
export class CalendarConfiguration {
  /**
   * Constructs a new <code>CalendarConfiguration</code>.
   * Configuration for the payroll calendar
   * @alias module:model/CalendarConfiguration
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>CalendarConfiguration</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CalendarConfiguration} obj Optional instance to populate.
   * @return {module:model/CalendarConfiguration} The populated <code>CalendarConfiguration</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CalendarConfiguration();
      if (data.hasOwnProperty('firstMonthOfYear'))
        obj.firstMonthOfYear = Month.constructFromObject(data['firstMonthOfYear']);
      if (data.hasOwnProperty('workingDays'))
        obj.workingDays = ApiClient.convertToType(data['workingDays'], [DayOfWeek]);
      if (data.hasOwnProperty('averageMonthDays'))
        obj.averageMonthDays = ApiClient.convertToType(data['averageMonthDays'], 'Number');
      if (data.hasOwnProperty('averageWorkDays'))
        obj.averageWorkDays = ApiClient.convertToType(data['averageWorkDays'], 'Number');
      if (data.hasOwnProperty('calculationMode'))
        obj.calculationMode = CalendarCalculationMode.constructFromObject(data['calculationMode']);
      if (data.hasOwnProperty('calendarWeekRule'))
        obj.calendarWeekRule = CalendarWeekRule.constructFromObject(data['calendarWeekRule']);
      if (data.hasOwnProperty('firstDayOfWeek'))
        obj.firstDayOfWeek = DayOfWeek.constructFromObject(data['firstDayOfWeek']);
    }
    return obj;
  }
}

/**
 * @member {module:model/Month} firstMonthOfYear
 */
CalendarConfiguration.prototype.firstMonthOfYear = undefined;

/**
 * The working days
 * @member {Array.<module:model/DayOfWeek>} workingDays
 */
CalendarConfiguration.prototype.workingDays = undefined;

/**
 * Average month days
 * @member {Number} averageMonthDays
 */
CalendarConfiguration.prototype.averageMonthDays = undefined;

/**
 * Average working days
 * @member {Number} averageWorkDays
 */
CalendarConfiguration.prototype.averageWorkDays = undefined;

/**
 * @member {module:model/CalendarCalculationMode} calculationMode
 */
CalendarConfiguration.prototype.calculationMode = undefined;

/**
 * @member {module:model/CalendarWeekRule} calendarWeekRule
 */
CalendarConfiguration.prototype.calendarWeekRule = undefined;

/**
 * @member {module:model/DayOfWeek} firstDayOfWeek
 */
CalendarConfiguration.prototype.firstDayOfWeek = undefined;

