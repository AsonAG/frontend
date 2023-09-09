import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useContext } from "react";
import { FieldContext } from "../FieldComponent";

function FieldValueBooleanComponent() {
    const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
    const checked = field.value ? field.value.toLowerCase() === "true" : false;

    function handleChange(e) {
        field.value = e.target.checked + "";
        buildCase();
    }

    return <FormControl required>
        <FormControlLabel
            required
            name={field.name}
            label={displayName}
            labelPlacement="start"
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

export default FieldValueBooleanComponent;