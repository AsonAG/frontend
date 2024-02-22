import dayjs from "dayjs";
import { useContext, useRef } from "react";
import { FieldContext } from "../Field";
import { DatePicker } from "../../../DatePicker";

export function FieldValueDateComponent({variant = "standard", propertyName = "value", displayName, required}) {
	const { field, isReadonly, required: fieldRequired, buildCase, displayName: fieldDisplayName } = useContext(FieldContext);
	const inputRef = useRef();
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;
	required ??= fieldRequired;
	displayName ??= fieldDisplayName;

	const handleDateChange = (newDate, context) => {
		const validationError = context.validationError ? "Invalid date" : "";
		inputRef.current?.setCustomValidity(validationError);
		if(!validationError) {
			field[propertyName] = newDate?.toISOString();
			buildCase();
		}
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
			onChange={handleDateChange}
			name={field.name}
			disabled={isReadonly}
			inputRef={inputRef}
			slotProps={{
				field: {
					required
				},
				openPickerButton: { tabIndex: -1 },
			}}
			sx={{
				flex: 1
			}}
		/>
	);
};
