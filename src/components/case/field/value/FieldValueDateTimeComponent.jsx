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

	const handleDateChange = (newDate) => {
                // transfer to date with time set at 00:00:00 UTC
                const utc = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000);
		setDateValue(utc);
		onChange(utc);
	};

	const handleDateTimeChange = (newDate) => {
		setDateValue(newDate);
		onChange(newDate);
	};

	return fieldValueType === "Date" ? (
		<DatePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleDateChange}
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
                        timezone={'UTC'}
		/>
	) : (
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

export default FieldValueDateTimeComponent;
