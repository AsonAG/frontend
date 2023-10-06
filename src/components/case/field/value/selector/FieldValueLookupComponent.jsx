import { useContext } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { FieldContext } from "../../EditFieldComponent";
import { useLookupData, useListData } from "../../../../../hooks/useDropdownData";


export function FieldValueLookupComponent() { return <FieldValueDropdownComponent useDataHook={useLookupData} />;}
export function FieldValueListComponent() { return <FieldValueDropdownComponent useDataHook={useListData} />;}

function FieldValueDropdownComponent({useDataHook}) {
  const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);

  function onChange(value) {
    field.value = value;
    buildCase();
  }

  const data = useDataHook(field, onChange);

  return (
    <Autocomplete
      {...data}
      disabled={isReadonly}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          required
          label={displayName}
          inputProps={{
            ...params.inputProps,
            required: (data.value?.length ?? 0) === 0
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {data.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}