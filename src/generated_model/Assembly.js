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
import {MethodInfo} from './MethodInfo';
import {Module} from './Module';
import {SecurityRuleSet} from './SecurityRuleSet';
import {Type} from './Type';
import {TypeInfo} from './TypeInfo';

/**
 * The Assembly model module.
 * @module model/Assembly
 * @version 1
 */
export class Assembly {
  /**
   * Constructs a new <code>Assembly</code>.
   * @alias module:model/Assembly
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>Assembly</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Assembly} obj Optional instance to populate.
   * @return {module:model/Assembly} The populated <code>Assembly</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new Assembly();
      if (data.hasOwnProperty('definedTypes'))
        obj.definedTypes = ApiClient.convertToType(data['definedTypes'], [TypeInfo]);
      if (data.hasOwnProperty('exportedTypes'))
        obj.exportedTypes = ApiClient.convertToType(data['exportedTypes'], [Type]);
      if (data.hasOwnProperty('codeBase'))
        obj.codeBase = ApiClient.convertToType(data['codeBase'], 'String');
      if (data.hasOwnProperty('entryPoint'))
        obj.entryPoint = MethodInfo.constructFromObject(data['entryPoint']);
      if (data.hasOwnProperty('fullName'))
        obj.fullName = ApiClient.convertToType(data['fullName'], 'String');
      if (data.hasOwnProperty('imageRuntimeVersion'))
        obj.imageRuntimeVersion = ApiClient.convertToType(data['imageRuntimeVersion'], 'String');
      if (data.hasOwnProperty('isDynamic'))
        obj.isDynamic = ApiClient.convertToType(data['isDynamic'], 'Boolean');
      if (data.hasOwnProperty('location'))
        obj.location = ApiClient.convertToType(data['location'], 'String');
      if (data.hasOwnProperty('reflectionOnly'))
        obj.reflectionOnly = ApiClient.convertToType(data['reflectionOnly'], 'Boolean');
      if (data.hasOwnProperty('isCollectible'))
        obj.isCollectible = ApiClient.convertToType(data['isCollectible'], 'Boolean');
      if (data.hasOwnProperty('isFullyTrusted'))
        obj.isFullyTrusted = ApiClient.convertToType(data['isFullyTrusted'], 'Boolean');
      if (data.hasOwnProperty('customAttributes'))
        obj.customAttributes = ApiClient.convertToType(data['customAttributes'], [CustomAttributeData]);
      if (data.hasOwnProperty('escapedCodeBase'))
        obj.escapedCodeBase = ApiClient.convertToType(data['escapedCodeBase'], 'String');
      if (data.hasOwnProperty('manifestModule'))
        obj.manifestModule = Module.constructFromObject(data['manifestModule']);
      if (data.hasOwnProperty('modules'))
        obj.modules = ApiClient.convertToType(data['modules'], [Module]);
      if (data.hasOwnProperty('globalAssemblyCache'))
        obj.globalAssemblyCache = ApiClient.convertToType(data['globalAssemblyCache'], 'Boolean');
      if (data.hasOwnProperty('hostContext'))
        obj.hostContext = ApiClient.convertToType(data['hostContext'], 'Number');
      if (data.hasOwnProperty('securityRuleSet'))
        obj.securityRuleSet = SecurityRuleSet.constructFromObject(data['securityRuleSet']);
    }
    return obj;
  }
}

/**
 * @member {Array.<module:model/TypeInfo>} definedTypes
 */
Assembly.prototype.definedTypes = undefined;

/**
 * @member {Array.<module:model/Type>} exportedTypes
 */
Assembly.prototype.exportedTypes = undefined;

/**
 * @member {String} codeBase
 */
Assembly.prototype.codeBase = undefined;

/**
 * @member {module:model/MethodInfo} entryPoint
 */
Assembly.prototype.entryPoint = undefined;

/**
 * @member {String} fullName
 */
Assembly.prototype.fullName = undefined;

/**
 * @member {String} imageRuntimeVersion
 */
Assembly.prototype.imageRuntimeVersion = undefined;

/**
 * @member {Boolean} isDynamic
 */
Assembly.prototype.isDynamic = undefined;

/**
 * @member {String} location
 */
Assembly.prototype.location = undefined;

/**
 * @member {Boolean} reflectionOnly
 */
Assembly.prototype.reflectionOnly = undefined;

/**
 * @member {Boolean} isCollectible
 */
Assembly.prototype.isCollectible = undefined;

/**
 * @member {Boolean} isFullyTrusted
 */
Assembly.prototype.isFullyTrusted = undefined;

/**
 * @member {Array.<module:model/CustomAttributeData>} customAttributes
 */
Assembly.prototype.customAttributes = undefined;

/**
 * @member {String} escapedCodeBase
 */
Assembly.prototype.escapedCodeBase = undefined;

/**
 * @member {module:model/Module} manifestModule
 */
Assembly.prototype.manifestModule = undefined;

/**
 * @member {Array.<module:model/Module>} modules
 */
Assembly.prototype.modules = undefined;

/**
 * @member {Boolean} globalAssemblyCache
 */
Assembly.prototype.globalAssemblyCache = undefined;

/**
 * @member {Number} hostContext
 */
Assembly.prototype.hostContext = undefined;

/**
 * @member {module:model/SecurityRuleSet} securityRuleSet
 */
Assembly.prototype.securityRuleSet = undefined;

