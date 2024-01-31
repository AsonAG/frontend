import { Link } from "@mui/material";
import { formatDate } from "./DateUtils";

// formats a case value based on the value type and attributes
export function formatCaseValue(caseValue, t) {
  
	switch (caseValue.valueType) {
		case "None":
    case "Document":
			return null;
		case "Date": 
      return formatDate(caseValue.value);
		case "DateTime":
      return formatDate(caseValue.value, true);
		case "Boolean":
      return t(caseValue.value === "true" ? "Yes" : "No");
		case "WebResource":
      return <Link href={caseValue.value} target="_blank" rel="noopener">{caseValue.value}</Link>
		case "Integer":
		case "NumericBoolean":
		case "Week":
		case "Year":
		case "Day":
		case "Hour":
		case "Distance":
		case "Month":
			return caseValue.value;
		case "Decimal":
      let decimalValue = caseValue.numericValue.toFixed(getDecimalPlaces(caseValue.attributes, 2));
      if (caseValue.attributes?.["input.units"]) {
        decimalValue += caseValue.attributes["input.units"];
      }
			return decimalValue;
		case "Percent":
			let decimalPlaces = getDecimalPlaces(caseValue.attributes, 2);
      return `${(caseValue.numericValue * 100).toFixed(decimalPlaces)}%`
		case "Money":
      let moneyValue = caseValue.value;
      if (caseValue.attributes?.["input.currency"]) {
        moneyValue = `${moneyValue} ${caseValue.attributes["input.currency"]}`;
      }
			return moneyValue;
		default:
			return caseValue.value;
	}
}

export function getDecimalPlaces(attributes, fallback) {
	let decimalPlaces = attributes?.["input.decimalPlaces"]
	if (decimalPlaces && typeof decimalPlaces === "number") {
		return decimalPlaces;
	}
	return fallback;
}