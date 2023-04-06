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
import {CaseBase} from './CaseBase';

/**
 * The CasesArray model module.
 * @module model/CasesArray
 * @version 1.0.11
 */
export class CasesArray extends Array {
  /**
   * Constructs a new <code>CasesArray</code>.
   * @alias module:model/CasesArray
   * @class
   * @extends Array
   */
  constructor() {
    super();
  }

  /**
   * Constructs a <code>CasesArray</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CasesArray} obj Optional instance to populate.
   * @return {module:model/CasesArray} The populated <code>CasesArray</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CasesArray();
      ApiClient.constructFromObject(data, obj, 'CaseBase');
    }
    return obj;
  }
}
