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
 * The ClusterSet model module.
 * @module model/ClusterSet
 * @version 1
 */
export class ClusterSet {
  /**
   * Constructs a new <code>ClusterSet</code>.
   * Cluster set
   * @alias module:model/ClusterSet
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>ClusterSet</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ClusterSet} obj Optional instance to populate.
   * @return {module:model/ClusterSet} The populated <code>ClusterSet</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new ClusterSet();
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('includeClusters'))
        obj.includeClusters = ApiClient.convertToType(data['includeClusters'], ['String']);
      if (data.hasOwnProperty('excludeClusters'))
        obj.excludeClusters = ApiClient.convertToType(data['excludeClusters'], ['String']);
    }
    return obj;
  }
}

/**
 * The filter name
 * @member {String} name
 */
ClusterSet.prototype.name = undefined;

/**
 * The included clusters
 * @member {Array.<String>} includeClusters
 */
ClusterSet.prototype.includeClusters = undefined;

/**
 * The excluded clusters
 * @member {Array.<String>} excludeClusters
 */
ClusterSet.prototype.excludeClusters = undefined;

