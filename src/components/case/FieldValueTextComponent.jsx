import { InputAdornment, TextField } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";

const FieldValueTextComponent = (
  fieldDisplayName,
  fieldDescription,
  required,
  fieldValue,
  handleTextValueChange,
  fieldValueType,
  fieldKey,
  slotInputProps,
  attributes
) => {
  const caseIsReadOnly = useContext(CaseContext);

  return (
    <TextField
      {...slotInputProps}
      label={fieldDisplayName}
      helperText={fieldDescription}
      required={required}
      value={fieldValue ? fieldValue : ""}
      onChange={handleTextValueChange}
      type={getInputTypeFromJsonType(fieldValueType)}
      name={fieldKey}
      key={fieldKey}
      multiline={attributes?.["input.multiLine"]}
      minRows={2}
      hidden={attributes?.["input.hidden"]}
      disabled={caseIsReadOnly || attributes?.["input.readOnly"]}
      
      InputProps={{
        endAdornment: getAdornmentFromJsonType(fieldValueType, fieldKey),

        sx: {
          // '&:hover fieldset': {
          //   borderColor: '#003566 !important'
          // },
          // '&:focus-within fieldset, &:focus-visible fieldset': {
          //   borderColor: '#003566 !important'
          // },
          // '& .MuiInputBase-colorPrimary': {
          //   borderColor: '#003566 !important'
          // },
          // "& .Mui-focused MuiInputBase-formControl": {
          //   borderColor: '#003566 !important'
          //   color
          // },
        },
      }}
      
      // InputLabelProps={{
      //   sx: {
      //     color: '#003566',
      //     textTransform: 'capitalize',
      //   },
      // }}
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

export default FieldValueTextComponent;
