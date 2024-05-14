import dayjs from "dayjs";
import { useContext } from "react";
import { FieldContext } from "../Field";
import { DatePicker } from "../../../DatePicker";

export function FieldValueDateComponent({
	variant = "standard",
	propertyName = "value",
	displayName,
	required,
}) {
	const {
		field,
		isReadonly,
		required: fieldRequired,
		buildCase,
		displayName: fieldDisplayName,
	} = useContext(FieldContext);
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;
	required ??= fieldRequired;
	displayName ??= fieldDisplayName;

	const handleDateChange = (newDate) => {
		field[propertyName] = newDate?.toISOString();
		buildCase();
	};

	if (field.attributes["input.datePicker"] === "Month") {
		variant = "month";
	}
	if (field.attributes["input.datePicker"] === "Year") {
		variant = "year";
	}

	return (
		<DatePicker
			variant={variant}
			label={displayName}
			value={value}
			required={required}
			onChange={handleDateChange}
			name={field.name}
			disabled={isReadonly}
			sx={{
				flex: 1,
			}}
		/>
	);
}
