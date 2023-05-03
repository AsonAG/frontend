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
import {CustomAttributeData} from './CustomAttributeData';
import {MemberTypes} from './MemberTypes';
import {Module} from './Module';
import {Type} from './Type';

/**
 * The MemberInfo model module.
 * @module model/MemberInfo
 * @version 1
 */
export class MemberInfo {
  /**
   * Constructs a new <code>MemberInfo</code>.
   * @alias module:model/MemberInfo
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>MemberInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MemberInfo} obj Optional instance to populate.
   * @return {module:model/MemberInfo} The populated <code>MemberInfo</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new MemberInfo();
      if (data.hasOwnProperty('memberType'))
        obj.memberType = MemberTypes.constructFromObject(data['memberType']);
      if (data.hasOwnProperty('name'))
        obj.name = ApiClient.convertToType(data['name'], 'String');
      if (data.hasOwnProperty('declaringType'))
        obj.declaringType = Type.constructFromObject(data['declaringType']);
      if (data.hasOwnProperty('reflectedType'))
        obj.reflectedType = Type.constructFromObject(data['reflectedType']);
      if (data.hasOwnProperty('module'))
        obj.module = Module.constructFromObject(data['module']);
      if (data.hasOwnProperty('customAttributes'))
        obj.customAttributes = ApiClient.convertToType(data['customAttributes'], [CustomAttributeData]);
      if (data.hasOwnProperty('isCollectible'))
        obj.isCollectible = ApiClient.convertToType(data['isCollectible'], 'Boolean');
      if (data.hasOwnProperty('metadataToken'))
        obj.metadataToken = ApiClient.convertToType(data['metadataToken'], 'Number');
    }
    return obj;
  }
}

/**
 * @member {module:model/MemberTypes} memberType
 */
MemberInfo.prototype.memberType = undefined;

/**
 * @member {String} name
 */
MemberInfo.prototype.name = undefined;

/**
 * @member {module:model/Type} declaringType
 */
MemberInfo.prototype.declaringType = undefined;

/**
 * @member {module:model/Type} reflectedType
 */
MemberInfo.prototype.reflectedType = undefined;

/**
 * @member {module:model/Module} module
 */
MemberInfo.prototype.module = undefined;

/**
 * @member {Array.<module:model/CustomAttributeData>} customAttributes
 */
MemberInfo.prototype.customAttributes = undefined;

/**
 * @member {Boolean} isCollectible
 */
MemberInfo.prototype.isCollectible = undefined;

/**
 * @member {Number} metadataToken
 */
MemberInfo.prototype.metadataToken = undefined;

