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
        <Stack useFlexGap gap={3} direction="row">
            <FieldValueDateComponent propertyName="start" displayName="Start" sx={{flex: 1}} />

            <Box sx={{flex: 1}}>
                {field.timeType != "Moment" && (
                    <FieldValueDateComponent propertyName="end" displayName="End" required={field.endMandatory} />
                )}
            </Box>
        </Stack>
    );
}

export default FieldPeriodSelector;