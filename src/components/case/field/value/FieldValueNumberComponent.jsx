import { NumericFormat } from "react-number-format";
import { InputAdornment, TextField } from "@mui/material";
import { validateMinMax } from "../../../../services/validators/FieldValueValidator";
import { useState, useContext } from "react";
import { FieldContext } from "../FieldComponent";
import { useUpdateEffect } from "usehooks-ts";

function getDecimalParams(valueType) {
  switch(valueType) {
    case "Integer":
    case "NumericBoolean":
      return { decimalScale: 0, fixedDecimalScale: true };
    case "Money":
      return { decimalScale: 2, fixedDecimalScale: true };
    default:
      return {};
  }
}

function FieldValueNumberComponent() {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
  const [value, setValue] = useState(field.value);
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    if (field.value === value) {
      return;
    }
    setIsValid(validateMinMax(value, field.attributes));
    field.value = value;
    buildCase();
  }

  const handleChange = (values) => {
    setValue(values.value);
  }

  useUpdateEffect(() => {
    setValue(field.value);
  }, [field.value]);

  return (
    <NumericFormat
      value={value}
      onValueChange={handleChange}
      valueIsNumericString
      error={!isValid}
      // TODO AJO 
      thousandSeparator={
        field.attributes?.["input.thousandSeparator"] ?? " "
      }
      {...getDecimalParams(field.valueType)}
      customInput={TextField}
      label={displayName}
      type={getInputTypeFromValueType(field.valueType)}
      name={field.name}
      required
      onBlur={handleBlur}
      disabled={isReadonly}
      InputProps={{
        endAdornment: getAdornmentFromValueType(
          field.valueType,
          field.attributes
        ),
        inputProps: {
          style: { textAlign: "right" },
        },
      }}
    />
  );
};

const getInputTypeFromValueType = (valueType) => {
  switch (valueType) {
    case "String":
      return "text";
    case "Boolean":
      return "Boolean";
    case "Number":
    case "Money":
    case "Decimal":
      return "numeric";
    default:
      return valueType;
  }
};

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
  return (
    <InputAdornment position="end">
      {adornment}
    </InputAdornment>
  );
};

export default FieldValueNumberComponent;
