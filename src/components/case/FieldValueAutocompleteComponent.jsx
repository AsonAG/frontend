import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import CasesApi from "../../api/CasesApi";
import ApiClient from "../../api/ApiClient";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";

function FieldValueAutocompleteComponent(
  fieldValue,
  fieldDescription,
  fieldKey,
  onChange,
  lookupSettings,
  slotInputProps,
  fieldDisplayName,
  attributes
) {
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const [isLookupOpened, setLookupOpened] = useState(false);
  const [openedOptions, setOpenedOptions] = useState([]);
  const multiLookup = attributes?.["input.multiLookup"];
  const [autocompleteFieldValue, setAutocompleteFieldValue] = useState(multiLookup ? [] : "");
  const [options, setOptions] = useState([]);
  const lookupLoading = isLookupOpened && openedOptions?.length === 0;

  useEffect(() => {
    let active = true;
    if (!lookupLoading) {
      return undefined;
    }
    casesApi.getCaseFieldLookups(lookupSettings.lookupName, callbackLookups);
    return () => {
      active = false;
    };
  }, [lookupLoading]);

  useUpdateEffect(() => {
    if (!isLookupOpened) {
      setOpenedOptions([]);
    } else {
      setOpenedOptions(
        options.map(
          (option) => JSON.parse(option.value)[lookupSettings.textFieldName]
        )
      );
    }
  }, [isLookupOpened]);

  useUpdateEffect(() => {
    if (multiLookup) {
      setAutocompleteFieldValue(
        fieldValue
          ? String(fieldValue).split(",").forEach(getLookupTextFromValue)
          : []
      );
    } else {
      setAutocompleteFieldValue(getLookupTextFromValue(fieldValue));
    }
  }, [options]);

  const callbackLookups = function (error, data, response) {
    if (error) {
      console.error(error);
    } else {
      setOptions(data[0].values);
      console.log("Lookups: " + JSON.stringify(data[0].values, null, 2));
    }
  };

  const getLookupValueFromText = (text) => {
    return options.find(
      (option) => option[lookupSettings.textFieldName] === text
    )[lookupSettings.valueFieldName];
  };

  const getLookupTextFromValue = (value) => {
    return options.length > 0
      ? options.find(
          (option) => option[lookupSettings.valueFieldName] === value
        )[lookupSettings.textFieldName]
      : null;
  };

  const handleInputLookupValueChange = (e, result) => {
    let newValue;
    // set multiLookup values
    if (Array.isArray(result)) {
      const resultsArray = result.forEach(getLookupValueFromText);
      newValue = resultsArray.join(",");
    }
    // set value for sinle Lookup
    else {
      newValue = getLookupValueFromText(result);
    }
    onChange(result, newValue);
  };

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
      options={openedOptions}
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
  (
    fieldKey,
    fieldDescription,
    slotInputProps,
    fieldDisplayName,
    lookupLoading
  ) =>
  (params) =>
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
