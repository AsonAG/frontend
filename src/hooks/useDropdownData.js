import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getLookupValues } from "../api/FetchClient";


function useDropdownData({ options, loading, fieldValue, multiple, labelIndex, valueIndex, onChange }) {
  const getOptionLabel = (option) => typeof option === "string" ? option : (option[labelIndex] ?? '')
  const getOptionValue = (option) => option ? option[valueIndex] : null;
  const isOptionEqualToValue = (option, value) => getOptionValue(option) === value;

  const selectedValues = useMemo(() => {
    if (loading) {
      return [];
    }
    if (!options?.length) {
      return fieldValue;
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

  return { multiple, options, loading, getOptionLabel, value: selectedValues, onChange: handleChange };
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