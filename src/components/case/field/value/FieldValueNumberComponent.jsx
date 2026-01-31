import { NumericFormat } from "react-number-format";
import { InputAdornment, TextField } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { FieldContext } from "../Field";
import { getDecimalPlaces } from "../../../../utils/Format";

function getDecimalParams({ valueType, attributes }) {
	switch (valueType) {
		case "Percent":
		case "Decimal":
			return {
				decimalScale: getDecimalPlaces(attributes, 2),
				fixedDecimalScale: true,
			};
		case "Integer":
		case "NumericBoolean":
			return { decimalScale: 0, fixedDecimalScale: true };
		case "Money":
			return { decimalScale: 2, fixedDecimalScale: true };
		default:
			return {};
	}
}

function validateMinMax(floatValue, attributes) {
	const maxValue = attributes?.["input.maxValue"];
	const minValue = attributes?.["input.minValue"];

	if (floatValue === null) return true;
	else if (maxValue && minValue)
		return floatValue <= maxValue && floatValue >= minValue;
	else if (maxValue) return floatValue <= maxValue;
	else if (minValue) return floatValue >= minValue;
	else return true;
}

function getValue(field) {
	if (field.value === null) return null;
	if (field.valueType === "Percent") {
		return field.value * 100;
	}
	return field.value;
}

function transformValue(field, value) {
	if (value === null) return null;
	if (field.valueType === "Percent") {
		return value / 100;
	}
	return value;
}

export function FieldValueNumberComponent() {
	const { field, isReadonly, required, displayName, buildCase } =
		useContext(FieldContext);
	const [value, setValue] = useState(getValue(field));
	const [isValid, setIsValid] = useState(true);

	const handleBlur = () => {
		if (value === null || value === "") {
			field.value = null;
			buildCase();
			return;
		}
		const floatValue = parseFloat(value);
		let val = transformValue(field, floatValue);
		if (field.value == val) {
			return;
		}
		setIsValid(validateMinMax(val, field.attributes));
		field.value = val?.toString();
		buildCase();
	};

	const handleChange = (values) => {
		setValue(values.value);

		const rawValue = values.value;
		if (rawValue === '' || rawValue == null) {
			// no value entered yet; treat as null
			field.value = null;
		} else {
			const floatValue = parseFloat(rawValue);
			const transformed = transformValue(field, floatValue);
			field.value = transformed != null ? transformed.toString() : null;
		}
	};

	// handle server reset
	useEffect(() => {
		const fieldValue = getValue(field);
		if (fieldValue !== value) {
			setValue(fieldValue);
		}
	}, [field.value]);

	return (
		<NumericFormat
			value={value ?? ""}
			onValueChange={handleChange}
			valueIsNumericString
			error={!isValid}
			// TODO AJO
			thousandSeparator={field.attributes?.["input.thousandSeparator"] ?? " "}
			{...getDecimalParams(field)}
			customInput={TextField}
			label={displayName}
			type="numeric"
			name={field.name}
			required={required}
			onBlur={handleBlur}
			disabled={isReadonly}
			InputProps={{
				endAdornment: getAdornmentFromValueType(
					field.valueType,
					field.attributes,
				),
				inputProps: {
					style: {
						textAlign: "right",
					},
				},
			}}
			sx={{
				flex: 1,
			}}
		/>
	);
}

const getAdornmentFromValueType = (valueType, attributes) => {
	let adornment;
	switch (valueType) {
		case "Money":
			adornment = attributes?.["input.currency"];
			break;
		case "Percent":
			adornment = "%";
			break;
		case "Decimal":
			adornment = attributes?.["input.units"];
			break;
		default:
			return <></>;
	}
	return <InputAdornment position="end">{adornment}</InputAdornment>;
};
