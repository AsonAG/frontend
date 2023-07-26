import { Autocomplete, TextField } from "@mui/material";

const SelectorComponent = (
  fieldKey,
  isMultiLookup,
  inputValue,
  handleChange,
  getOptions,
  getLookupTextFromValue,
  caseIsReadOnly,
  fieldDisplayName,
  slotInputProps
) => {
  return (
    <Autocomplete
      name={fieldKey}
      multiple={isMultiLookup}
      value={inputValue}
      onChange={handleChange}
      options={getOptions}
      getOptionLabel={getLookupTextFromValue}
      key={fieldKey+'_autocomplete'}
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

export default SelectorComponent;
