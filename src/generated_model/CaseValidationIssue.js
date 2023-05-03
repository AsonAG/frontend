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
import {CaseIssueType} from './CaseIssueType';

/**
 * The CaseValidationIssue model module.
 * @module model/CaseValidationIssue
 * @version 1
 */
export class CaseValidationIssue {
  /**
   * Constructs a new <code>CaseValidationIssue</code>.
   * Represents an issue from the case validation
   * @alias module:model/CaseValidationIssue
   * @class
   * @param issueType {module:model/CaseIssueType} 
   * @param caseName {String} Gets the name of the case
   * @param message {String} Gets the validation message
   */
  constructor(issueType, caseName, message) {
    this.issueType = issueType;
    this.caseName = caseName;
    this.message = message;
  }

  /**
   * Constructs a <code>CaseValidationIssue</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CaseValidationIssue} obj Optional instance to populate.
   * @return {module:model/CaseValidationIssue} The populated <code>CaseValidationIssue</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new CaseValidationIssue();
      if (data.hasOwnProperty('issueType'))
        obj.issueType = CaseIssueType.constructFromObject(data['issueType']);
      if (data.hasOwnProperty('number'))
        obj._number = ApiClient.convertToType(data['number'], 'Number');
      if (data.hasOwnProperty('caseName'))
        obj.caseName = ApiClient.convertToType(data['caseName'], 'String');
      if (data.hasOwnProperty('caseNameLocalizations'))
        obj.caseNameLocalizations = ApiClient.convertToType(data['caseNameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('caseSlot'))
        obj.caseSlot = ApiClient.convertToType(data['caseSlot'], 'String');
      if (data.hasOwnProperty('caseSlotLocalizations'))
        obj.caseSlotLocalizations = ApiClient.convertToType(data['caseSlotLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('caseFieldName'))
        obj.caseFieldName = ApiClient.convertToType(data['caseFieldName'], 'String');
      if (data.hasOwnProperty('caseFieldNameLocalizations'))
        obj.caseFieldNameLocalizations = ApiClient.convertToType(data['caseFieldNameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('sourceCaseName'))
        obj.sourceCaseName = ApiClient.convertToType(data['sourceCaseName'], 'String');
      if (data.hasOwnProperty('sourceCaseNameLocalizations'))
        obj.sourceCaseNameLocalizations = ApiClient.convertToType(data['sourceCaseNameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('sourceCaseSlot'))
        obj.sourceCaseSlot = ApiClient.convertToType(data['sourceCaseSlot'], 'String');
      if (data.hasOwnProperty('sourceCaseSlotLocalizations'))
        obj.sourceCaseSlotLocalizations = ApiClient.convertToType(data['sourceCaseSlotLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('targetCaseName'))
        obj.targetCaseName = ApiClient.convertToType(data['targetCaseName'], 'String');
      if (data.hasOwnProperty('targetCaseNameLocalizations'))
        obj.targetCaseNameLocalizations = ApiClient.convertToType(data['targetCaseNameLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('targetCaseSlot'))
        obj.targetCaseSlot = ApiClient.convertToType(data['targetCaseSlot'], 'String');
      if (data.hasOwnProperty('targetCaseSlotLocalizations'))
        obj.targetCaseSlotLocalizations = ApiClient.convertToType(data['targetCaseSlotLocalizations'], {'String': 'String'});
      if (data.hasOwnProperty('message'))
        obj.message = ApiClient.convertToType(data['message'], 'String');
    }
    return obj;
  }
}

/**
 * @member {module:model/CaseIssueType} issueType
 */
CaseValidationIssue.prototype.issueType = undefined;

/**
 * The issue number (negative issue type)
 * @member {Number} _number
 */
CaseValidationIssue.prototype._number = undefined;

/**
 * Gets the name of the case
 * @member {String} caseName
 */
CaseValidationIssue.prototype.caseName = undefined;

/**
 * The localized case names
 * @member {Object.<String, String>} caseNameLocalizations
 */
CaseValidationIssue.prototype.caseNameLocalizations = undefined;

/**
 * The case slot
 * @member {String} caseSlot
 */
CaseValidationIssue.prototype.caseSlot = undefined;

/**
 * The localized case slot names
 * @member {Object.<String, String>} caseSlotLocalizations
 */
CaseValidationIssue.prototype.caseSlotLocalizations = undefined;

/**
 * Gets the name of the case field
 * @member {String} caseFieldName
 */
CaseValidationIssue.prototype.caseFieldName = undefined;

/**
 * The localized case field names
 * @member {Object.<String, String>} caseFieldNameLocalizations
 */
CaseValidationIssue.prototype.caseFieldNameLocalizations = undefined;

/**
 * The relation source case name
 * @member {String} sourceCaseName
 */
CaseValidationIssue.prototype.sourceCaseName = undefined;

/**
 * The localized source case names
 * @member {Object.<String, String>} sourceCaseNameLocalizations
 */
CaseValidationIssue.prototype.sourceCaseNameLocalizations = undefined;

/**
 * The relation source case slot
 * @member {String} sourceCaseSlot
 */
CaseValidationIssue.prototype.sourceCaseSlot = undefined;

/**
 * The localized source case slots
 * @member {Object.<String, String>} sourceCaseSlotLocalizations
 */
CaseValidationIssue.prototype.sourceCaseSlotLocalizations = undefined;

/**
 * The relation target case name
 * @member {String} targetCaseName
 */
CaseValidationIssue.prototype.targetCaseName = undefined;

/**
 * The localized target case names
 * @member {Object.<String, String>} targetCaseNameLocalizations
 */
CaseValidationIssue.prototype.targetCaseNameLocalizations = undefined;

/**
 * The relation target case slot
 * @member {String} targetCaseSlot
 */
CaseValidationIssue.prototype.targetCaseSlot = undefined;

/**
 * The localized target case slots
 * @member {Object.<String, String>} targetCaseSlotLocalizations
 */
CaseValidationIssue.prototype.targetCaseSlotLocalizations = undefined;

/**
 * Gets the validation message
 * @member {String} message
 */
CaseValidationIssue.prototype.message = undefined;

