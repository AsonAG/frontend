import { useContext, useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import ReactInputMask from "react-input-mask";
import { FieldContext } from "../Field";
import { useTranslation } from "react-i18next";

export function FieldValueTextComponent() {
  const { field, isReadonly, required, displayName, buildCase } = useContext(FieldContext);
  const [value, setValue] = useState(field.value);
  const [isValid, setIsValid] = useState(true);
  const { t } = useTranslation();
  const inputRef = useRef();
  const isMaskedInput = !!field.attributes?.["input.mask"];

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

  useEffect(() => {
    if (field.value !== value) {
      setValue(field.value);
    }
  }, [field.value, setValue]);

	// We need to set the validity ourselves, because the MUI Datepicker
	// populates the input field with a placeholder.
	// The default HTML Form validation error message won't display because of that.
	useEffect(() => {
    if (!required) {
      inputRef.current?.setCustomValidity("");
      return;
    }
    let validationError = "";
    if (isMaskedInput && !validateMask(value, field.attributes)) {
      validationError = t("Please enter a valid value");
    } else if (!value)  {
      validationError = t("Please enter a value");
    }
		inputRef.current?.setCustomValidity(validationError);
	}, [value, inputRef.current, isMaskedInput, required]);

  if (!isMaskedInput) {
    return <TextField
      label={displayName}
      required={required}
      value={value || ''}
      inputRef={inputRef}
      onChange={handleChange}
      onBlur={handleBlur}
      type="text"
      name={field.name}
      multiline={field.attributes?.["input.multiLine"]}
      minRows={2}
      maxRows={6}
      disabled={isReadonly}
      error={!isValid}
      sx={{
        flex: 1
      }}
    />;
  }

  return (
    // TODO AJO fix error "findDOMNode is deprecated in StrictMode"
    <ReactInputMask
      mask={field.attributes["input.mask"]}
      maskChar={MASK_CHAR}
      value={value || ''}
      onChange={handleChange}
      required={required}
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
          required={required}
          inputRef={inputRef}
          sx={{
            flex: 1
          }}
        />
      )}
    </ReactInputMask>
  )
};

const MASK_CHAR = "_";
const maskRegex = new RegExp(MASK_CHAR, 'g');

function validateMask(stringValue, attributes) {
  if (!attributes?.["input.mask"]) return true;
  else return !maskRegex.test(attributes["input.mask"]) && !maskRegex.test(stringValue);
}
