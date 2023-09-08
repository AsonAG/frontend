import { Autocomplete, TextField } from "@mui/material";
import { useContext } from "react";
import { CaseFormContext } from "../../../../../scenes/global/CasesForm";

function FieldValueListComponent({ field, isReadonly }) {
  const { buildCase } = useContext(CaseFormContext);
  const isMultiOptions = fieldattributes["input.multiList"];

  const value = useMemo(() => parseSelectorValueInput(field.value, isMultiOptions), [field.value]);

  const handleChange = (e, value) => {
    const outputValue = Array.isArray(value) ? value.join(",") : value;
    field.value = outputValue;
    buildCase();
  };

  <Autocomplete
    required
    name={field.name}
    multiple={isMultiOptions}
    value={value}
    onChange={handleChange}
    options={field.attributes["input.list"]}
    getOptionLabel={getTextFromValue}
    disabled={isReadonly}
    renderInput={<TextField {...params} label={field.displayName} />}
    fullWidth
  />
}

function parseSelectorValueInput(input, isMultiOptions) {
  if (isMultiOptions) {
    return input ? String(input).split(",") : [];
  }
  return input ? input : null;
}

export default FieldValueListComponent;
