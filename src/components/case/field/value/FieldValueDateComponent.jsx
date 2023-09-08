import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function FieldValueDateComponent({field, propertyName, displayName, isReadonly, required = true})
{
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;

	displayName ??= field.displayName;

	const handleDateChange = (newDate) => {
		field[propertyName] = newDate?.format();
		// TODO AJO submit
	};

	return (
		<DatePicker
			label={displayName}
			value={value}
			onChange={handleDateChange}
			name={field.name}
			timezone="UTC"
			disabled={isReadonly}
			views={["year", "month", "day"]}
			slotProps={{
				field: { required }
			}}
		/>
	);
};

export default FieldValueDateComponent;
