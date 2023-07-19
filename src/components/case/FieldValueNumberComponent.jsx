import { NumberFormatBase, NumericFormat } from "react-number-format";
import { InputAdornment, TextField } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";
import ReactInputMask from "react-input-mask";

const FieldValueNumberComponent = (
  fieldDisplayName,
  fieldDescription,
  required,
  fieldValue,
  handleNumberValueChange,
  handleTextBlur,
  fieldValueType,
  fieldKey,
  slotInputProps,
  attributes,
  caseIsReadOnly,
  isInteger
) => {
  const decimalParams = isInteger
    ? {
        decimalScale: 0,
        fixedDecimalScale: true,
      }
    : fieldValueType === "Money"
    ? {
        decimalScale: 2,
        fixedDecimalScale: true,
      }
    : {};

  return (
    <NumericFormat
      value={fieldValue}
      // onChange={handleNumberValueChange}
      onValueChange={handleNumberValueChange}
      isNumericString
      thousandSeparator={
        attributes?.["input.thousandSeparator"]
          ? attributes["input.thousandSeparator"]
          : " "
      }
      {...decimalParams}
      customInput={TextField}
      // <TextField
      {...slotInputProps}
      label={fieldDisplayName}
      helperText={fieldDescription}
      type={getInputTypeFromJsonType(fieldValueType)}
      name={fieldKey}
      key={fieldKey}
      required={required}
      onBlur={handleTextBlur}
      disabled={caseIsReadOnly}
      InputProps={{
        endAdornment: getAdornmentFromJsonType(
          fieldValueType,
          fieldKey,
          attributes
        ),
        inputProps: {
          style: { textAlign: "right" },
        },
      }}
      // /> )}
    />
  );
};

const getInputTypeFromJsonType = (jsonType) => {
  switch (jsonType) {
    case "String":
      return "text";
    case "Boolean":
      return "Boolean";
    case "Number":
      return "numeric";
    case "Money":
      return "numeric";
    case "Decimal":
      return "numeric";
    default:
      return jsonType;
  }
};

const getAdornmentFromJsonType = (jsonType, fieldId, attributes) => {
  let adornment;
  switch (jsonType) {
    case "Money":
      adornment = attributes?.["input.currency"];
      break;
    case "Percent":
      adornment = "%";
      break;
    case "Distance":
      adornment = attributes?.["input.distanceMeasure"];
      break;
    default:
      return <></>;
  }
  return (
    <InputAdornment key={"numbertype_adornment_" + fieldId} position="end">
      {adornment}
    </InputAdornment>
  );
};

export default FieldValueNumberComponent;
