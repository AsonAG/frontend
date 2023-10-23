export const MASK_CHAR = "_";
const maskRegex = new RegExp(MASK_CHAR, 'g');




/**
 * @param {string} stringValue
 * @param {object} attributes
 * @returns {boolean} returns if the value is valid or not
 */
export function validateMask(stringValue, attributes) {
  if (!attributes?.["input.mask"]) return true;
  else return !maskRegex.test(attributes["input.mask"]) && !maskRegex.test(stringValue);
}
