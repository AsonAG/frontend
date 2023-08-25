import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

const FieldValueDateTimeComponent = (
	fieldDisplayName,
	fieldValueType,
	required,
	fieldValue,
	onChange,
	fieldKey,
	slotInputProps,
	caseIsReadOnly
) => {
	const [dateValue, setDateValue] = useState(
		fieldValue ? new Date(fieldValue) : null
	);

	useEffect(() => {
		const newDate = dateValue ? new Date(dateValue) : null;
		setDateValue(newDate);
	}, [fieldValue]);

	const handleChange = (dateValue) => {
		// const newDate = new Date(dateValue);
		const newDate = dateValue;
		setDateValue(newDate);
		onChange(newDate);
	};

	return fieldValueType === "Date" ? (
		<DatePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleChange}
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
		/>
	) : (
		<DateTimePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleChange}
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
		/>
	);
};
function isValidDate(date) {
	return (
		date &&
		Object.prototype.toString.call(date) === "[object Date]" &&
		!isNaN(date)
	);
}

const getValidatedDate = (dateValue) => {
	let newDate = dateValue;
	if (isValidDate(dateValue)) newDate = new Date(dateValue);
	return newDate;
};

export default FieldValueDateTimeComponent;
