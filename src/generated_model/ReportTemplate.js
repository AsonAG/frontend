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
import {Language} from './Language';
import {ObjectStatus} from './ObjectStatus';

/**
 * The ReportTemplate model module.
 * @module model/ReportTemplate
 * @version 1
 */
export class ReportTemplate {
  /**
   * Constructs a new <code>ReportTemplate</code>.
   * The report template API object
   * @alias module:model/ReportTemplate
   * @class
   * @param language {module:model/Language} 
   * @param content {String} The report content (client owned)
   */
  constructor(language, content) {
    this.language = language;
    this.content = content;
  }

  /**
   * Constructs a <code>ReportTemplate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ReportTemplate} obj Optional instance to populate.
   * @return {module:model/ReportTemplate} The populated <code>ReportTemplate</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ReportTemplate();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'Number');
      if (data.hasOwnProperty('status'))
        obj.status = ObjectStatus.constructFromObject(data['status']);
      if (data.hasOwnProperty('created'))
        obj.created = ApiClient.convertToType(data['created'], 'Date');
      if (data.hasOwnProperty('updated'))
        obj.updated = ApiClient.convertToType(data['updated'], 'Date');
      if (data.hasOwnProperty('language'))
        obj.language = Language.constructFromObject(data['language']);
      if (data.hasOwnProperty('content'))
        obj.content = ApiClient.convertToType(data['content'], 'String');
      if (data.hasOwnProperty('contentType'))
        obj.contentType = ApiClient.convertToType(data['contentType'], 'String');
      if (data.hasOwnProperty('schema'))
        obj.schema = ApiClient.convertToType(data['schema'], 'String');
      if (data.hasOwnProperty('resource'))
        obj.resource = ApiClient.convertToType(data['resource'], 'String');
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
ReportTemplate.prototype.id = undefined;

/**
 * @member {module:model/ObjectStatus} status
 */
ReportTemplate.prototype.status = undefined;

/**
 * The date which the API object was created (immutable)
 * @member {Date} created
 */
ReportTemplate.prototype.created = undefined;

/**
 * The date which the API object was last updated (immutable)
 * @member {Date} updated
 */
ReportTemplate.prototype.updated = undefined;

/**
 * @member {module:model/Language} language
 */
ReportTemplate.prototype.language = undefined;

/**
 * The report content (client owned)
 * @member {String} content
 */
ReportTemplate.prototype.content = undefined;

/**
 * The report content type
 * @member {String} contentType
 */
ReportTemplate.prototype.contentType = undefined;

/**
 * The report schema (client owned)
 * @member {String} schema
 */
ReportTemplate.prototype.schema = undefined;

/**
 * The report external resource
 * @member {String} resource
 */
ReportTemplate.prototype.resource = undefined;

/**
 * Custom attributes
 * @member {Object.<String, Object>} attributes
 */
ReportTemplate.prototype.attributes = undefined;

