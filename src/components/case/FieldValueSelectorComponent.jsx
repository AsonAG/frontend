import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete, FormControl, InputLabel, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import CasesApi from "../../api/CasesApi";
import ApiClient from "../../api/ApiClient";
import { UserContext } from "../../App";
import { useUpdateEffect } from "usehooks-ts";
import { MenuItem } from "react-pro-sidebar";

function FieldValueSelectorComponent(
  fieldValue,
  fieldDescription,
  fieldKey,
  onChange,
  onBlur,
  lookupSettings,
  slotInputProps,
  fieldDisplayName,
  attributes
) {
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const isMultiLookup = attributes?.["input.multiLookup"];
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(
    fieldValue
      ? isMultiLookup
        ? String(fieldValue).split(",")
        : fieldValue
      : isMultiLookup
      ? []
      : null
  );

  // init
  useEffect(() => {
    casesApi.getCaseFieldLookups(lookupSettings.lookupName, callbackLookups);
  }, []);

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

  const handleChange = (e, keyValue) => {
    setInputValue(keyValue);
    
    let outputValue;
    if (Array.isArray(keyValue)) {
      outputValue = keyValue.join(",");
    } else outputValue = keyValue;
    onChange(outputValue);
    
  };

  const handleClose = () => {
    let outputValue;
    if (Array.isArray(inputValue)) {
      outputValue = inputValue.join(",");
    } else outputValue = inputValue;
    onBlur(outputValue);
  };

  return (
    <Autocomplete
      name={fieldKey}
      multiple={isMultiLookup}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleClose}
      options={options.map((option) => option[lookupSettings.valueFieldName])}
      getOptionLabel={getLookupTextFromValue}
      key={fieldKey}
      renderInput={renderedInput(
        fieldKey,
        fieldDescription,
        slotInputProps,
        fieldDisplayName
      )}
    />
  );
}

const renderedInput =
  (fieldKey, fieldDescription, slotInputProps, fieldDisplayName) => (params) =>
    (
      <TextField
        helperText={fieldDescription}
        key={fieldKey + "_renderedInput"}
        {...slotInputProps}
        {...params}
        label={fieldDisplayName}
        InputProps={{
          ...params.InputProps,
        }}
      />
    );

export default FieldValueSelectorComponent;
