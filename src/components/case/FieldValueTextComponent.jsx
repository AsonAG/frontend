import { InputAdornment, TextField } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";

const FieldValueTextComponent = (
  fieldDisplayName,
  fieldDescription,
  required,
  fieldValue,
  handleTextValueChange,
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
      onChange={handleTextValueChange}
      onBlur={handleTextBlur}
      type="text"
      name={fieldKey}
      key={fieldKey}
      multiline={attributes?.["input.multiLine"]}
      minRows={2}
      disabled={caseIsReadOnly}
      // InputLabelProps={{
      //   sx: {
      //     color: '#003566',
      //     textTransform: 'capitalize',
      //   },
      // }}
    />
  );
};

export default FieldValueTextComponent;
