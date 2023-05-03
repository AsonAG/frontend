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
import {DataRelation} from './DataRelation';
import {ObjectStatus} from './ObjectStatus';
import {ReportAttributeMode} from './ReportAttributeMode';

/**
 * The Report model module.
 * @module model/Report
 * @version 1
 */
export class Report {
  /**
   * Constructs a new <code>Report</code>.
   * The report API object
   * @alias module:model/Report
   * @class
   * @param name {String} The payroll result report name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Constructs a <code>Report</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Report} obj Optional instance to populate.
   * @return {module:model/Report} The populated <code>Report</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Report();
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
      if (data.hasOwnProperty('category'))
        obj.category = ApiClient.convertToType(data['category'], 'String');
      if (data.hasOwnProperty('attributeMode'))
        obj.attributeMode = ReportAttributeMode.constructFromObject(data['attributeMode']);
      if (data.hasOwnProperty('queries'))
        obj.queries = ApiClient.convertToType(data['queries'], {'String': 'String'});
      if (data.hasOwnProperty('relations'))
        obj.relations = ApiClient.convertToType(data['relations'], [DataRelation]);
      if (data.hasOwnProperty('buildExpression'))
        obj.buildExpression = ApiClient.convertToType(data['buildExpression'], 'String');
      if (data.hasOwnProperty('startExpression'))
        obj.startExpression = ApiClient.convertToType(data['startExpression'], 'String');
      if (data.hasOwnProperty('endExpression'))
        obj.endExpression = ApiClient.convertToType(data['endExpression'], 'String');
      if (data.hasOwnProperty('attributes'))
        obj.attributes = ApiClient.convertToType(data['attributes'], {'String': Object});
      if (data.hasOwnProperty('clusters'))
        obj.clusters = ApiClient.convertToType(data['clusters'], ['String']);
    }
    return obj;
  }
}

/**
 * The unique object id (immutable)
 * @member {Number} id
 */
Report.prototype.id = undefined;

/**
 * @member {module:model/ObjectStatus} status
 */
Report.prototype.status = undefined;

/**
 * The date which the API object was created (immutable)
 * @member {Date} created
 */
Report.prototype.created = undefined;

/**
 * The date which the API object was last updated (immutable)
 * @member {Date} updated
 */
Report.prototype.updated = undefined;

/**
 * The payroll result report name
 * @member {String} name
 */
Report.prototype.name = undefined;

/**
 * The localized payroll result report names
 * @member {Object.<String, String>} nameLocalizations
 */
Report.prototype.nameLocalizations = undefined;

/**
 * The payroll result report description
 * @member {String} description
 */
Report.prototype.description = undefined;

/**
 * The localized payroll result report descriptions
 * @member {Object.<String, String>} descriptionLocalizations
 */
Report.prototype.descriptionLocalizations = undefined;

/**
 * The report category
 * @member {String} category
 */
Report.prototype.category = undefined;

/**
 * @member {module:model/ReportAttributeMode} attributeMode
 */
Report.prototype.attributeMode = undefined;

/**
 * The report queries, key is the query name and value the api operation name
 * @member {Object.<String, String>} queries
 */
Report.prototype.queries = undefined;

/**
 * The report data relations, based on the queries
 * @member {Array.<module:model/DataRelation>} relations
 */
Report.prototype.relations = undefined;

/**
 * The report build expression
 * @member {String} buildExpression
 */
Report.prototype.buildExpression = undefined;

/**
 * The report start expression
 * @member {String} startExpression
 */
Report.prototype.startExpression = undefined;

/**
 * The report end expression
 * @member {String} endExpression
 */
Report.prototype.endExpression = undefined;

/**
 * Custom attributes
 * @member {Object.<String, Object>} attributes
 */
Report.prototype.attributes = undefined;

/**
 * The wage type clusters
 * @member {Array.<String>} clusters
 */
Report.prototype.clusters = undefined;

