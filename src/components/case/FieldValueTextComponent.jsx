import { InputAdornment, TextField } from "@mui/material";
import { CaseContext } from "../../scenes/global/CasesForm";
import { useContext } from "react";
import ReactInputMask from "react-input-mask";

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
  if (attributes?.["input.mask"])
    return (
      <ReactInputMask
        mask={attributes["input.mask"]}
        // maskChar={null}
        value={fieldValue}
        onChange={handleTextValueChange}
        required={required}
        onBlur={handleTextBlur}
        disabled={caseIsReadOnly}
      >
        {() => (
          <TextField
            {...slotInputProps}
            label={fieldDisplayName}
            helperText={fieldDescription}
            type="text"
            name={fieldKey}
            key={fieldKey}
            multiline={attributes?.["input.multiLine"]}
            minRows={2}
            // InputLabelProps={{
            //   sx: {
            //     color: '#003566',
            //     textTransform: 'capitalize',
            //   },
            // }}
          />
        )}
      </ReactInputMask>
    );
  else
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
