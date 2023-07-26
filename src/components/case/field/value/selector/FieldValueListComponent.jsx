import { useEffect, useState } from "react";
import SelectorComponent, { parseSelectorValueInput } from "./SelectorComponent";

function FieldValueListComponent(
  fieldValue,
  fieldKey,
  onChange,
  lookupSettings,
  slotInputProps,
  fieldDisplayName,
  attributes,
  caseIsReadOnly
) {
  const isMultiOptions = attributes["input.multiList"];
  const [options, setOptions] = useState(attributes["input.list"]);
  const getOptions = Object.values(options);

  // init
  useEffect(() => {
    setOptions(attributes["input.list"]);
  }, []);
  
  const getTextFromValue = (value) => {
    return Object.keys(options).find(key => options[key] === value);
  };

  return SelectorComponent(
    fieldKey,
    isMultiOptions,
    fieldValue,
    onChange,
    getOptions,
    getTextFromValue,
    caseIsReadOnly,
    fieldDisplayName,
    slotInputProps
  );
}

export default FieldValueListComponent;
