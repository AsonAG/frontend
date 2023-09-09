import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext } from "react";
import { FieldContext } from "../FieldComponent";

function FieldValueDateComponent({propertyName, displayName, required = true}) {
	const { field, isReadonly, buildCase, displayName: fieldDisplayName } = useContext(FieldContext);
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;

	displayName ??= fieldDisplayName;

	const handleDateChange = (newDate) => {
		field[propertyName] = newDate?.format();
		buildCase();
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
