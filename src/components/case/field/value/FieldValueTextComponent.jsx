import { TextField } from "@mui/material";
import ReactInputMask from "react-input-mask";
import { MASK_CHAR } from "../../../../services/validators/FieldValueValidator";
import FieldValueLookupComponent from "./selector/FieldValueLookupComponent";
import FieldValueListComponent from "./selector/FieldValueListComponent";
import { useEffect, useState } from "react";

const FieldValueTextComponent = (
  attributes,
  fieldValue,
  handleTextValueChange,
  required,
  handleTextBlur,
  caseIsReadOnly,
  slotInputProps,
  fieldDisplayName,
  fieldKey
) => {
  if (attributes?.["input.mask"])
    return (
      <ReactInputMask
        mask={attributes["input.mask"]}
        maskChar={MASK_CHAR}
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
            type="text"
            name={fieldKey}
            key={fieldKey+'_textfield'}
            multiline={attributes?.["input.multiLine"]}
            minRows={2}
          />
        )}
      </ReactInputMask>
    );
  else
    return (
      <TextField
        {...slotInputProps}
        label={fieldDisplayName}
        required={required}
        value={fieldValue}
        onChange={handleTextValueChange}
        onBlur={handleTextBlur}
        type="text"
        name={fieldKey}
        key={fieldKey+'_textfield'}
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
