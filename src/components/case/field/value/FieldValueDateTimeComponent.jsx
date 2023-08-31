import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

const FieldValueDateTimeComponent = (
	fieldDisplayName,
	required,
	fieldValue,
	onChange,
	fieldKey,
	slotInputProps,
	caseIsReadOnly
) => {
	const [dateValue, setDateValue] = useState(toDateObject(fieldValue));

	useEffect(() => {
		setDateValue(toDateObject(fieldValue));
	}, [fieldValue]);

	const handleDateTimeChange = (newDate) => {
		setDateValue(newDate);
		onChange(newDate);
	};

	return (
		<DateTimePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleDateTimeChange}
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
		/>
	);
};

const toDateObject = (value) => {
	if (value) {
		return new Date(value);
	} else return null;
};

export default FieldValueDateTimeComponent;
