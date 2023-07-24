import { useEffect, useState } from "react";
import SelectorComponent from "./SelectorComponent";

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
  const isMultiOptions = attributes?.["input.multiList"];
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(
    fieldValue
      ? isMultiOptions
        ? String(fieldValue).split(",")
        : fieldValue
      : isMultiOptions
      ? []
      : null
  );
  const getOptions = Object.values(options);

  // init
  useEffect(() => {
    setOptions(attributes?.["input.list"]);
  }, []);

  const getTextFromValue = (value) => {
    return Object.keys(options).find(key => options[key] === value);
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
    getTextFromValue,
    caseIsReadOnly,
    fieldDisplayName,
    slotInputProps
  );
}

export default FieldValueListComponent;
