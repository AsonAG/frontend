import { Autocomplete, TextField } from "@mui/material";
import { useContext, useMemo } from "react";
import { FieldContext } from "../../FieldComponent";

function FieldValueListComponent() {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
  const isMultiOptions = field.attributes["input.multiList"];

  const getLabelFromOption = (option) => option ? option[0] : null;
  const getValueFromOption = (option) => option ? option[1] : null;
  const isOptionEqualToValue = (option, value) => getValueFromOption(option) === value;

  const options = useMemo(() => Object.entries(field.attributes["input.list"] || {}))

  const selectedOptions = useMemo(() => {
    if (!options?.length) {
      return field.value;
    }

    if (isMultiOptions) {
      const values = field.value ? field.value.split(",") : [];
      return values.map(v => options.find(o => isOptionEqualToValue(o, v)) ?? v);
    }
    const value = field.value ? field.value : null;
    return options.find(o => isOptionEqualToValue(o, value)) ?? value;
  }, [field.value, options]);

  const handleChange = (_, option) => {
    const outputValue = isMultiOptions ? option.map(getValueFromOption).join(",") : getValueFromOption(option);
    field.value = outputValue;
    buildCase();
  };

  return <Autocomplete
    required
    name={field.name}
    multiple={isMultiOptions}
    value={selectedOptions}
    onChange={handleChange}
    options={options}
    getOptionLabel={getLabelFromOption}
    disabled={isReadonly}
    renderInput={props => <TextField {...props} label={displayName} />}
    fullWidth
  />
}

export default FieldValueListComponent;
