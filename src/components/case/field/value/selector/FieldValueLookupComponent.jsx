import { useEffect, useState, useMemo, useContext } from "react";
import { useParams } from "react-router";
import { getLookupValues } from "../../../../../api/FetchClient";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { FieldContext } from "../../EditFieldComponent";
import { useLookupData } from "../../../../../hooks/useLookupData";


function FieldValueLookupComponent() {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
  const data = useLookupData(field);
  const { tenantId, payrollId } = useParams();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMultiOptions = field.attributes["input.multiLookup"];

  const getValueFromOption = (option) => option ? option[field.lookupSettings["valueFieldName"]] : null;
  const getLabelFromOption = (option) => typeof option === "string" ? option : (option[field.lookupSettings["textFieldName"]] ?? '')
  const isOptionEqualToValue = (option, value) => getValueFromOption(option) === value;

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
    

  const handleChange = (_, option) => {
    const outputValue = Array.isArray(option) ? option.map(getValueFromOption).join(",") : getValueFromOption(option);
    field.value = outputValue;
    buildCase();
  };

  
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

  return (
    <Autocomplete
      multiple={isMultiOptions}
      getOptionLabel={getLabelFromOption}
      value={selectedOptions}
      onChange={handleChange}
      options={options}
      loading={loading}
      disabled={isReadonly}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label={displayName}
          inputProps={{
            ...params.inputProps,
            required: (selectedOptions?.length ?? 0) === 0
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default FieldValueLookupComponent;
