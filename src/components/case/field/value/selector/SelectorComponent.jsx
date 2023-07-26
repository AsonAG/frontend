import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useUpdateEffect } from "usehooks-ts";

const SelectorComponent = (
  fieldKey,
  isMultiOptions,
  fieldValue,
  onChange,
  getOptions,
  getTextFromValue,
  caseIsReadOnly,
  fieldDisplayName,
  slotInputProps
) => {
  const [inputValue, setInputValue] = useState(parseSelectorValueInput(fieldValue, isMultiOptions));

  useUpdateEffect(() => {
    setInputValue(parseSelectorValueInput(fieldValue, isMultiOptions));
  }, [fieldValue]);

  const handleChange = (e, keyValue) => {
    setInputValue(keyValue);

    let outputValue;
    if (Array.isArray(keyValue)) {
      outputValue = keyValue.join(",");
    } else outputValue = keyValue;

    onChange(outputValue);
  };

  return (
    <Autocomplete
      name={fieldKey}
      multiple={isMultiOptions}
      value={inputValue}
      onChange={handleChange}
      options={getOptions}
      getOptionLabel={getTextFromValue}
      key={fieldKey + "_autocomplete"}
      disabled={caseIsReadOnly}
      renderInput={renderedInput(fieldKey, fieldDisplayName, slotInputProps)}
      fullWidth
    />
  );
};

const renderedInput =
  (fieldKey, fieldDisplayName, slotInputProps) => (params) =>
    (
      <TextField
        key={fieldKey + "_renderedInput"}
        {...params}
        label={fieldDisplayName}
        {...slotInputProps}
        InputProps={{
          ...params.InputProps,
        }}
      />
    );

export function parseSelectorValueInput(input, isMultiOptions) {
  let val;
  if (isMultiOptions) {
    val = input ? String(input).split(",") : [];
    // return val.map((item) => ({
    //   [lookupSettings.valueFieldName]: item,
    //   [lookupSettings.textFieldName]: getLookupTextFromValue(item),
    // }));
  } else {
    val = input ? input : null;
    // return {
    //   [lookupSettings.valueFieldName]: val,
    //   [lookupSettings.textFieldName]: getLookupTextFromValue(val),
    // };
  }
  return val;
}

export default SelectorComponent;
