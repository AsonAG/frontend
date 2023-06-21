import { Fragment, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";

function FieldValueAutocompleteComponent(
  fieldValue,
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
  if (attributes?.["input.multiLookup"]) {
    const fieldValueArray = fieldValue
      ? Array.isArray(fieldValue)
        ? fieldValue
        : JSON.parse(fieldValue)
      : [];
    const options = lookupOptions.map(
      (option) => JSON.parse(option.value)[lookupSettings.textFieldName]
    );

    return (
      <Autocomplete
        name={fieldKey}
        multiple
        open={isLookupOpened}
        onOpen={() => {
          setLookupOpened(true);
        }}
        onClose={() => {
          setLookupOpened(false);
        }}
        value={fieldValueArray}
        // inputValue={fieldValue}
        onChange={handleInputLookupValueChange}
        options={options}
        loading={lookupLoading}
        key={fieldKey}
        renderInput={renderedInput(fieldKey, slotInputProps, fieldDisplayName, lookupLoading)}
      />
    );
  } else
    return (
      <Autocomplete
        name={fieldKey}
        open={isLookupOpened}
        onOpen={() => {
          setLookupOpened(true);
        }}
        onClose={() => {
          setLookupOpened(false);
        }}
        // value={fieldValue}
        // inputValue={fieldValue}
        onChange={handleInputLookupValueChange}
        isOptionEqualToValue={(option, value) =>
          JSON.parse(option?.value)[lookupSettings.textFieldName] ===
          JSON.parse(value?.value)[lookupSettings.textFieldName]
        }
        getOptionLabel={(option) =>
          JSON.parse(option?.value)[lookupSettings.textFieldName]
        }
        options={lookupOptions}
        loading={lookupLoading}
        renderInput={renderedInput(fieldKey, slotInputProps, fieldDisplayName, lookupLoading)}
      />
    );
}

const renderedInput = (fieldKey, slotInputProps, fieldDisplayName, lookupLoading) => (params) => (
    <TextField
      key={fieldKey + '_renderedInput'}
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
      }} />
  );

  export default FieldValueAutocompleteComponent;
