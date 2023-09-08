import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useContext } from "react";
import { CaseFormContext } from "../../../../scenes/global/CasesForm";


function FieldValueBooleanComponent({ field, isReadonly }) {
    const { buildCase } = useContext(CaseFormContext);
    const checked = field.value ? field.value.toLowerCase() === "true" : false;

    function handleChange(e) {
        field.value = e.target.checked + "";
        buildCase();
    }

    return <FormControl required>
        <FormControlLabel
            required
            name={field.name}
            label={field.displayName}
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