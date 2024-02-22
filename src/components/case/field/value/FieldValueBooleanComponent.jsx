import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useContext } from "react";
import { FieldContext } from "../Field";

export function FieldValueBooleanComponent() {
    const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
    const checked = field.value ? field.value.toLowerCase() === "true" : false;
    // make sure null values are sent as false
    field.value = checked + "";

    function handleChange(e) {
        field.value = e.target.checked + "";
        buildCase();
    }

    return <FormControl sx={{flex: 1}}>
        <FormControlLabel
            name={field.name}
            label={displayName}
            labelPlacement="end"
            control={
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    disabled={isReadonly}
                />
            }
        />
    </FormControl>
}
