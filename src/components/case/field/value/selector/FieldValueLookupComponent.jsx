import { useContext, useEffect, useMemo, useState } from "react";
import ApiClient from "../../../../../api/ApiClient";
import CasesApi from "../../../../../api/CasesApi";
import { UserContext } from "../../../../../App";
import SelectorComponent from "./SelectorComponent";
import { useUpdateEffect } from "usehooks-ts";

function FieldValueLookupComponent(
  fieldValue,
  fieldKey,
  onChange,
  lookupSettings,
  slotInputProps,
  fieldDisplayName,
  attributes,
  caseIsReadOnly
) {
  const { user, setUser } = useContext(UserContext);
  const casesApi = useMemo(() => new CasesApi(ApiClient, user), [user]);
  const isMultiOptions = attributes["input.multiLookup"];
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(parseLookupValueInput(fieldValue, isMultiOptions));

  const getOptions = options.map(
    (option) => option[lookupSettings.valueFieldName]
  );

  // init
  useEffect(() => {
    casesApi.getCaseFieldLookups(lookupSettings.lookupName, callbackLookups);
  }, []);

  useUpdateEffect(() => {
    setInputValue(parseLookupValueInput(fieldValue, isMultiOptions));
  }, [fieldValue]);

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

  return SelectorComponent(
    fieldKey,
    isMultiOptions,
    inputValue,
    handleChange,
    getOptions,
    getLookupTextFromValue,
    caseIsReadOnly,
    fieldDisplayName,
    slotInputProps
  );
}

const parseLookupValueInput = (input, isMultiOptions) => {
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
};

export default FieldValueLookupComponent;
