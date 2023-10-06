import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getLookupValues } from "../api/FetchClient";

function getOptionData(option, index) {
  if (!option) return '';
  if (Array.isArray(option) && !option.length) return '';
  if (typeof option === "string") return option;
  return option[index];
}

function useDropdownData({ options, loading, fieldValue, multiple, labelIndex, valueIndex, onChange }) {
  const getOptionLabel = (option) => getOptionData(option, labelIndex);
  const getOptionValue = (option) => getOptionData(option, valueIndex);
  const isOptionEqualToValue = (option, value) => getOptionValue(option) === value;

  const selectedValues = useMemo(() => {
    if (loading || !options?.length) {
      return [];
    }
    const findValue = (value) => options.find(o => isOptionEqualToValue(o, value)) ?? value;
    if (multiple) {
      const values = fieldValue ? fieldValue.split(",") : [];
      return values.map(findValue);
    }
    return findValue(fieldValue ? fieldValue : null);
  }, [fieldValue, options, loading]);
  

  const handleChange = (_, option) => {
    const outputValue = multiple ? option.map(getOptionValue).join(",") : getOptionValue(option);
    onChange(outputValue);
  };

  const getLabels = () => multiple ? selectedValues.map(getOptionLabel).join(", ") : getOptionLabel(selectedValues);

  return { multiple, options, loading, getLabels, getOptionLabel, value: selectedValues, onChange: handleChange };
}

export function useListData(field, onChange) {
  const options = useMemo(() => Object.entries(field.attributes["input.list"] || {}))
  const dataConfig = {
    onChange,
    options,
    fieldValue: field.value,
    loading: false,
    multiple: field.attributes["input.multiList"],
    labelIndex: 0,
    valueIndex: 1
  }
  return useDropdownData(dataConfig);
}

export function useLookupData(field, onChange) {
  const { tenantId, payrollId } = useParams();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const lookupData = await getLookupValues({tenantId, payrollId}, field.lookupSettings.lookupName);
      const lookupValues = lookupData[0].values.map(lv => JSON.parse(lv.value));

      if (active) {
        setOptions(lookupValues);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const dataConfig = {
    onChange,
    options,
    loading,
    fieldValue: field.value,
    multiple: field.attributes["input.multiLookup"] ?? false,
    labelIndex: field.lookupSettings["textFieldName"],
    valueIndex: field.lookupSettings["valueFieldName"]
  };

  return useDropdownData(dataConfig);
}