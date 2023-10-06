import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getLookupValues } from "../api/FetchClient";


export function useLookupData(field, buildCase) {
  const { tenantId, payrollId } = useParams();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMultiOptions = field.attributes["input.multiLookup"];

  const getValueFromOption = (option) => option ? option[field.lookupSettings["valueFieldName"]] : null;
  const getLabelFromOption = (option) => typeof option === "string" ? option : (option[field.lookupSettings["textFieldName"]] ?? '')
  const isOptionEqualToValue = (option, value) => getValueFromOption(option) === value;

  const handleChange = (_, option) => {
    const outputValue = Array.isArray(option) ? option.map(getValueFromOption).join(",") : getValueFromOption(option);
    field.value = outputValue;
    buildCase();
  };

  const selectedOptions = useMemo(() => {
    if (loading) {
      return [];
    }

    if (!options?.length) {
      return field.value;
    }

    if (isMultiOptions) {
      const values = field.value ? String(field.value).split(",") : [];
      return values.map(v => options.find(o => isOptionEqualToValue(o, v)) ?? v);
    }
    const value = field.value ? field.value : null;
    return options.find(o => isOptionEqualToValue(o, value)) ?? value;
  }, [field.value, loading, options]);


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
}