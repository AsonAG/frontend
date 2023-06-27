import { Fragment, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

function FieldValueAutocompleteComponent(
  fieldValue,
  fieldDescription,
  fieldKey,
  isLookupOpened,
  setLookupOpened,
  handleInputLookupValueChange,
  lookupSettings,
  lookupOptions,
  lookupLoading,
  slotInputProps,
  fieldDisplayName,
  attributes
) {
  const multiLookup = attributes?.["input.multiLookup"];
  const options = lookupOptions?.map(
    (option) => JSON.parse(option.value)[lookupSettings.textFieldName]
  );
  let autocompleteFieldValue;

  if (multiLookup) {
    autocompleteFieldValue = fieldValue
      ? Array.isArray(fieldValue)
        ? fieldValue
        : JSON.parse(fieldValue)
      : [];
  } else {
    autocompleteFieldValue = fieldValue;
  }

  return (
    <Autocomplete
      name={fieldKey}
      multiple={multiLookup}
      open={isLookupOpened}
      onOpen={() => {
        setLookupOpened(true);
      }}
      onClose={() => {
        setLookupOpened(false);
      }}
      value={autocompleteFieldValue}
      // inputValue={fieldValue}
      onChange={handleInputLookupValueChange}
      options={options}
      loading={lookupLoading}
      key={fieldKey}
      renderInput={renderedInput(
        fieldKey,
        fieldDescription,
        slotInputProps,
        fieldDisplayName,
        lookupLoading
      )}
      
    />
  );
}

const renderedInput =
  (fieldKey, fieldDescription, slotInputProps, fieldDisplayName, lookupLoading) => (params) =>
    (
      <TextField
      helperText={fieldDescription}
      key={fieldKey + "_renderedInput"}
        {...slotInputProps}
        {...params}
        label={fieldDisplayName}
        InputProps={{
          ...params.InputProps,
             endAdornment: (
            <Fragment>
              {lookupLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : null}
              {params.InputProps.endAdornment}
            </Fragment>
          ),
        }}
      />
    );

export default FieldValueAutocompleteComponent;
