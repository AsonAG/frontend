import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import CasesApi from "../../api/CasesApi";
import ApiClient from "../../api/ApiClient";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";

function FieldValueLookupComponent(
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
  const [autocompleteFieldValue, setAutocompleteFieldValue] = useState(
    multiLookup ? [] : ""
  );
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
        options.map((option) => option[lookupSettings.textFieldName])
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
      const optionValues = data[0].values.map((option) =>
        JSON.parse(option.value)
      );
      setOptions(optionValues);
      console.log("Lookup options: " + JSON.stringify(optionValues, null, 2));
    }
  };

  const getLookupValueFromText = (text) => {
    return options.find(
      (option) => option[lookupSettings.textFieldName] === text
    )[lookupSettings.valueFieldName];
  };

  const getLookupTextFromValue = (value) => {
    if (value && options.length > 0) {
      const optionFound = options.find(
        (option) => option[lookupSettings.valueFieldName] === value
      );
      return optionFound ? optionFound[lookupSettings.textFieldName] : "";
    } else return "";
  };

  const handleInputLookupValueChange = (e, textValue) => {
    let keyValue;
    // set multiLookup values
    if (Array.isArray(textValue)) {
      const resultsArray = textValue.forEach(getLookupValueFromText);
      keyValue = resultsArray.join(",");
    }
    // set value for sinle Lookup
    else {
      keyValue = getLookupValueFromText(textValue);
      setLookupOpened(false);
    }
    if (keyValue) onChange(textValue, keyValue);
    else console.warn("Lookup value OnChange error: Key Value is empty");
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

export default FieldValueLookupComponent;
