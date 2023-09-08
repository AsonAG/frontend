import { Stack, Box } from "@mui/system";
import FieldValueDateComponent from "./value/FieldValueDateComponent";

function FieldPeriodSelector({field}) {
    const isStartEndVisible =
        field.timeType != "Timeless" &&
        !field.attributes?.["input.hideStartEnd"];

    if (!isStartEndVisible) {
        return <div></div>
    }

    return (
        <Stack gap={3} direction="row">
            <FieldValueDateComponent field={field} propertyName="start" displayName="Start" />

            <Box>
                {field.timeType != "Moment" && (
                    <FieldValueDateComponent field={field} propertyName="end" displayName="End" required={field.endMandatory} />
                )}
            </Box>
        </Stack>
    );
}

export default FieldPeriodSelector;