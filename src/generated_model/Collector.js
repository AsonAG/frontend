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
import {CollectType} from './CollectType';
import {ObjectStatus} from './ObjectStatus';
import {OverrideType} from './OverrideType';
import {ValueType} from './ValueType';

/**
 * The Collector model module.
 * @module model/Collector
 * @version 1
 */
export class Collector {
  /**
   * Constructs a new <code>Collector</code>.
   * The regulation collector API object
   * @alias module:model/Collector
   * @class
   * @param collectType {module:model/CollectType} 
   * @param name {String} The collector name (immutable)
   */
  constructor(collectType, name) {
    this.collectType = collectType;
    this.name = name;
  }

  /**
   * Constructs a <code>Collector</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Collector} obj Optional instance to populate.
   * @return {module:model/Collector} The populated <code>Collector</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Collector();
      if (data.hasOwnProperty('id'))
        obj.id = ApiClient.convertToType(data['id'], 'Number');
      if (data.hasOwnProperty('status'))
        obj.status = ObjectStatus.constructFromObject(data['status']);
      if (data.hasOwnProperty('created'))
        obj.created = ApiClient.convertToType(data['created'], 'Date');
      if (data.hasOwnProperty('updated'))
        obj.updated = ApiClient.convertToType(data['updated'], 'Date');
      if (data.hasOwnProperty('collectType'))
        obj.collectType = CollectType.constructFromObject(data['collectType']);
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('nameLocalizations'))
        obj.nameLocalizations = ApiClient.convertToType(data['nameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('overrideType'))
        obj.overrideType = OverrideType.constructFromObject(data['overrideType']);
      if (data.hasOwnProperty('valueType'))
        obj.valueType = ValueType.constructFromObject(data['valueType']);
      if (data.hasOwnProperty('collectorGroups'))
        obj.collectorGroups = ApiClient.convertToType(data['collectorGroups'], ['String']);
      if (data.hasOwnProperty('threshold'))
        obj.threshold = ApiClient.convertToType(data['threshold'], 'Number');
      if (data.hasOwnProperty('minResult'))
        obj.minResult = ApiClient.convertToType(data['minResult'], 'Number');
      if (data.hasOwnProperty('maxResult'))
        obj.maxResult = ApiClient.convertToType(data['maxResult'], 'Number');
      if (data.hasOwnProperty('startExpression'))
        obj.startExpression = ApiClient.convertToType(data['startExpression'], 'String');
      if (data.hasOwnProperty('applyExpression'))
        obj.applyExpression = ApiClient.convertToType(data['applyExpression'], 'String');
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
Collector.prototype.id = undefined;

/**
 * @member {module:model/ObjectStatus} status
 */
Collector.prototype.status = undefined;

/**
 * The date which the API object was created (immutable)
 * @member {Date} created
 */
Collector.prototype.created = undefined;

/**
 * The date which the API object was last updated (immutable)
 * @member {Date} updated
 */
Collector.prototype.updated = undefined;

/**
 * @member {module:model/CollectType} collectType
 */
Collector.prototype.collectType = undefined;

/**
 * The collector name (immutable)
 * @member {String} name
 */
Collector.prototype.name = undefined;

/**
 * The localized collector names
 * @member {Object.<String, String>} nameLocalizations
 */
Collector.prototype.nameLocalizations = undefined;

/**
 * @member {module:model/OverrideType} overrideType
 */
Collector.prototype.overrideType = undefined;

/**
 * @member {module:model/ValueType} valueType
 */
Collector.prototype.valueType = undefined;

/**
 * Associated collector groups
 * @member {Array.<String>} collectorGroups
 */
Collector.prototype.collectorGroups = undefined;

/**
 * The threshold value
 * @member {Number} threshold
 */
Collector.prototype.threshold = undefined;

/**
 * The minimum allowed value
 * @member {Number} minResult
 */
Collector.prototype.minResult = undefined;

/**
 * The maximum allowed value
 * @member {Number} maxResult
 */
Collector.prototype.maxResult = undefined;

/**
 * Expression used while the collector is started
 * @member {String} startExpression
 */
Collector.prototype.startExpression = undefined;

/**
 * Expression used while applying a value to the collector
 * @member {String} applyExpression
 */
Collector.prototype.applyExpression = undefined;

/**
 * Expression used while the collector is ended
 * @member {String} endExpression
 */
Collector.prototype.endExpression = undefined;

/**
 * Custom attributes
 * @member {Object.<String, Object>} attributes
 */
Collector.prototype.attributes = undefined;

/**
 * The collector clusters
 * @member {Array.<String>} clusters
 */
Collector.prototype.clusters = undefined;

