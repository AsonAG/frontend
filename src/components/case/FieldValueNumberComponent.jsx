import { InputAdornment, TextField } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";

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
  caseIsReadOnly
) => {
  return (
    <TextField
      {...slotInputProps}
      label={fieldDisplayName}
      helperText={fieldDescription}
      required={required}
      value={fieldValue}
      onChange={handleNumberValueChange}
      onBlur={handleTextBlur}
      type={getInputTypeFromJsonType(fieldValueType)}
      name={fieldKey}
      key={fieldKey}
      disabled={caseIsReadOnly}
      InputProps={{
        endAdornment: getAdornmentFromJsonType(fieldValueType, fieldKey),
      }}
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

const getAdornmentFromJsonType = (jsonType, fieldId) => {
  let adornment;
  switch (jsonType) {
    case "Money":
      adornment = "CHF";
      break;
    case "Percent":
      adornment = "%";
      break;
    case "Distance":
      adornment = "m";
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
