import { useContext, useEffect, useMemo, useState } from "react";
import ApiClient from "../../../../../api/ApiClient";
import CasesApi from "../../../../../api/CasesApi";
import { UserContext } from "../../../../../App";
import SelectorComponent, { parseSelectorValueInput } from "./SelectorComponent";
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

  const getOptions = options.map(
    (option) => option[lookupSettings.valueFieldName]
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

  const getLookupTextFromValue = (value) => {
    if (value && options.length > 0) {
      const optionFound = options.find(
        (option) => option[lookupSettings.valueFieldName] === value
      );
      return optionFound ? optionFound[lookupSettings.textFieldName] : "";
    } else return "";
  };

  return SelectorComponent(
    fieldKey,
    isMultiOptions,
    fieldValue,
    onChange,
    getOptions,
    getLookupTextFromValue,
    caseIsReadOnly,
    fieldDisplayName,
    slotInputProps
  );
}

export default FieldValueLookupComponent;
