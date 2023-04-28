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
import {ObjectStatus} from './ObjectStatus';
import {ReportParameterType} from './ReportParameterType';
import {ValueType} from './ValueType';

/**
 * The ReportParameter model module.
 * @module model/ReportParameter
 * @version 1
 */
export class ReportParameter {
  /**
   * Constructs a new <code>ReportParameter</code>.
   * The report parameter API object
   * @alias module:model/ReportParameter
   * @class
   * @param name {String} The report parameter name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Constructs a <code>ReportParameter</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ReportParameter} obj Optional instance to populate.
   * @return {module:model/ReportParameter} The populated <code>ReportParameter</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ReportParameter();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'Number');
      if (data.hasOwnProperty('status'))
        obj.status = ObjectStatus.constructFromObject(data['status']);
      if (data.hasOwnProperty('created'))
        obj.created = ApiClient.convertToType(data['created'], 'Date');
      if (data.hasOwnProperty('updated'))
        obj.updated = ApiClient.convertToType(data['updated'], 'Date');
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('nameLocalizations'))
        obj.nameLocalizations = ApiClient.convertToType(data['nameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('description'))
        obj.description = ApiClient.convertToType(data['description'], 'String');
      if (data.hasOwnProperty('descriptionLocalizations'))
        obj.descriptionLocalizations = ApiClient.convertToType(data['descriptionLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('mandatory'))
        obj.mandatory = ApiClient.convertToType(data['mandatory'], 'Boolean');
      if (data.hasOwnProperty('value'))
        obj.value = ApiClient.convertToType(data['value'], 'String');
      if (data.hasOwnProperty('valueType'))
        obj.valueType = ValueType.constructFromObject(data['valueType']);
      if (data.hasOwnProperty('parameterType'))
        obj.parameterType = ReportParameterType.constructFromObject(data['parameterType']);
      if (data.hasOwnProperty('attributes'))
        obj.attributes = ApiClient.convertToType(data['attributes'], {'String': Object});
    }
    return obj;
  }
}

/**
 * The unique object id (immutable)
 * @member {Number} id
 */
ReportParameter.prototype.id = undefined;

/**
 * @member {module:model/ObjectStatus} status
 */
ReportParameter.prototype.status = undefined;

/**
 * The date which the API object was created (immutable)
 * @member {Date} created
 */
ReportParameter.prototype.created = undefined;

/**
 * The date which the API object was last updated (immutable)
 * @member {Date} updated
 */
ReportParameter.prototype.updated = undefined;

/**
 * The report parameter name
 * @member {String} name
 */
ReportParameter.prototype.name = undefined;

/**
 * The localized wage type names
 * @member {Object.<String, String>} nameLocalizations
 */
ReportParameter.prototype.nameLocalizations = undefined;

/**
 * The report parameter description
 * @member {String} description
 */
ReportParameter.prototype.description = undefined;

/**
 * The localized report parameter descriptions
 * @member {Object.<String, String>} descriptionLocalizations
 */
ReportParameter.prototype.descriptionLocalizations = undefined;

/**
 * The parameter mandatory state
 * @member {Boolean} mandatory
 */
ReportParameter.prototype.mandatory = undefined;

/**
 * The parameter value (JSON)
 * @member {String} value
 */
ReportParameter.prototype.value = undefined;

/**
 * @member {module:model/ValueType} valueType
 */
ReportParameter.prototype.valueType = undefined;

/**
 * @member {module:model/ReportParameterType} parameterType
 */
ReportParameter.prototype.parameterType = undefined;

/**
 * Custom attributes
 * @member {Object.<String, Object>} attributes
 */
ReportParameter.prototype.attributes = undefined;

