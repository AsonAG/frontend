export const MASK_CHAR = "_";
const maskRegex = new RegExp(MASK_CHAR, 'g');


/**
 * @param {string} stringValue
 * @param {object} attributes
 * @returns {boolean} returns if the value is valid or not
 */
export function validateMinMax(stringValue, attributes) {
  const maxValue = attributes?.["input.maxValue"];
  const minValue = attributes?.["input.minValue"];

  const floatValue = parseFloat(stringValue);

  if (floatValue === null) return true;
  else if (maxValue && minValue)
    return floatValue <= maxValue && floatValue >= minValue;
  else if (maxValue) return floatValue <= maxValue;
  else if (minValue) return floatValue >= minValue;
  else return true;
}

/**
 * @param {string} stringValue
 * @param {object} attributes
 * @returns {boolean} returns if the value is valid or not
 */
export function validateMask(stringValue, attributes) {
  if (!attributes?.["input.mask"]) return true;
  else return !maskRegex.test(attributes["input.mask"]) && !maskRegex.test(stringValue);
}
