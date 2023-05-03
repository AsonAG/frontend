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
import {ConstructorInfo} from './ConstructorInfo';
import {CustomAttributeNamedArgument} from './CustomAttributeNamedArgument';
import {CustomAttributeTypedArgument} from './CustomAttributeTypedArgument';
import {Type} from './Type';

/**
 * The CustomAttributeData model module.
 * @module model/CustomAttributeData
 * @version 1
 */
export class CustomAttributeData {
  /**
   * Constructs a new <code>CustomAttributeData</code>.
   * @alias module:model/CustomAttributeData
   * @class
   */
  constructor() {
  }

  /**
   * Constructs a <code>CustomAttributeData</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeData} obj Optional instance to populate.
   * @return {module:model/CustomAttributeData} The populated <code>CustomAttributeData</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CustomAttributeData();
      if (data.hasOwnProperty('attributeType'))
        obj.attributeType = Type.constructFromObject(data['attributeType']);
      if (data.hasOwnProperty('constructor'))
        obj.constructor = ConstructorInfo.constructFromObject(data['constructor']);
      if (data.hasOwnProperty('constructorArguments'))
        obj.constructorArguments = ApiClient.convertToType(data['constructorArguments'], [CustomAttributeTypedArgument]);
      if (data.hasOwnProperty('namedArguments'))
        obj.namedArguments = ApiClient.convertToType(data['namedArguments'], [CustomAttributeNamedArgument]);
    }
    return obj;
  }
}

/**
 * @member {module:model/Type} attributeType
 */
CustomAttributeData.prototype.attributeType = undefined;

/**
 * @member {module:model/ConstructorInfo} constructor
 */
CustomAttributeData.prototype.constructor = undefined;

/**
 * @member {Array.<module:model/CustomAttributeTypedArgument>} constructorArguments
 */
CustomAttributeData.prototype.constructorArguments = undefined;

/**
 * @member {Array.<module:model/CustomAttributeNamedArgument>} namedArguments
 */
CustomAttributeData.prototype.namedArguments = undefined;

