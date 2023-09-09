import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext } from "react";
import { FieldContext } from "../FieldComponent";

function FieldValueDateTimeComponent() {
	const { field, isReadonly, displayName, buildCase } = useContext(FieldContext);
	const value = field.value ? dayjs.utc(field.value) : null;

	const handleChange = (newDate) => {
		field.value = newDate.format();
		buildCase();
	};

	return (
		<DateTimePicker
			label={displayName}
			value={value}
			onChange={handleChange}
			timezone="UTC"
			name={field.name}
			disabled={isReadonly}
			slotProps={{
				field: { required: true }
			}}
		/>
	);
};

export default FieldValueDateTimeComponent;
