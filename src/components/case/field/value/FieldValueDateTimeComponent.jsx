import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function FieldValueDateTimeComponent({ field, isReadonly })
{
	const value = field.value ? dayjs.utc(field.value) : null;

	const handleChange = (newDate) => {
		field.value = newDate.format();
		// TODO AJO submit
	};

	return (
		<DateTimePicker
			label={field.displayName + "*"}
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
