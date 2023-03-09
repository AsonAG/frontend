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
import { ApiClient } from "../ApiClient";
import { CaseField } from "./CaseField";

/**
 * The CaseDetails model module.
 * @module model/CaseDetails
 * @version 1.0.11
 */
export class CaseDetails {
  /**
   * Constructs a new <code>CaseDetails</code>.
   * @alias module:model/CaseDetails
   * @class
   */
  constructor() {}

  /**
   * Constructs a <code>CaseDetails</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CaseDetails} obj Optional instance to populate.
   * @return {module:model/CaseDetails} The populated <code>CaseDetails</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CaseDetails();
      if (data.hasOwnProperty("name"))
        obj.name = ApiClient.convertToType(data["name"], "String");
      if (data.hasOwnProperty("fields"))
        obj.fields = ApiClient.convertToType(data["fields"], [CaseField]);
      if (data.hasOwnProperty("relatedCases"))
        obj.relatedCases = ApiClient.convertToType(data["relatedCases"], [
          CaseDetails,
        ]);
    }
    return obj;
  }
}

/**
 * The case name (immutable)
 * @member {String} name
 */
CaseDetails.prototype.name = undefined;

/**
 * @member {Array.<module:model/CaseField>} fields
 */
CaseDetails.prototype.fields = [];

/**
 * @member {Array.<module:model/CaseDetails>} relatedCases
 */
CaseDetails.prototype.relatedCases = undefined;
