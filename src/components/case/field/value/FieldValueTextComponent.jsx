import { useContext, useState } from "react";
import { TextField } from "@mui/material";
import ReactInputMask from "react-input-mask";
import { MASK_CHAR, validateMask } from "../../../../services/validators/FieldValueValidator";
import { useUpdateEffect } from "usehooks-ts";
import { FieldContext } from "../EditFieldComponent";

function FieldValueTextComponent() {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
  const [value, setValue] = useState(field.value);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const handleBlur = () => {
    if (field.value === value) {
      return;
    }

    setIsValid(validateMask(value, field.attributes));

    field.value = value;
    buildCase();
  }

  useUpdateEffect(() => {
    setValue(field.value);
  }, [field.value]);

  if (!field.attributes?.["input.mask"]) {
    return <TextField
      label={displayName}
      required
      value={value || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      type="text"
      name={field.name}
      multiline={field.attributes?.["input.multiLine"]}
      minRows={2}
      maxRows={6}
      disabled={isReadonly}
      error={!isValid}
    />;
  }

  return (
    // TODO AJO fix error "findDOMNode is deprecated in StrictMode"
    <ReactInputMask
      mask={field.attributes["input.mask"]}
      maskChar={MASK_CHAR}
      value={value || ''}
      onChange={handleChange}
      required
      onBlur={handleBlur}
      disabled={isReadonly}
    >
      {() => (
        <TextField
          label={displayName}
          type="text"
          name={field.name}
          multiline={field.attributes?.["input.multiLine"]}
          minRows={2}
          maxRows={6}
          error={!isValid}
          required
        />
      )}
    </ReactInputMask>
  )
};

export default FieldValueTextComponent;
