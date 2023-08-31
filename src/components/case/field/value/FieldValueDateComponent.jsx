import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";

const FieldValueDateComponent = (
	fieldDisplayName,
	required,
	fieldValue,
	onChange,
	fieldKey,
	slotInputProps,
	caseIsReadOnly
) => {
	const [dateValue, setDateValue] = useState(makeLocalAppearUTC(fieldValue));

	useEffect(() => {
		setDateValue(makeLocalAppearUTC(fieldValue));
	}, [fieldValue]);

	const handleDateChange = (newDate) => {
		// transfer to date with time set at 00:00:00 UTC
		setDateValue(newDate);
		const utc = localToUTC(newDate);
		onChange(utc);
	};

	return (
		<DateTimePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleDateChange}
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
			views={["year", "month", "day"]}
		/>
	);
};

const getTimezoneOffset = (value) => value.getTimezoneOffset() * 60000;

const makeLocalAppearUTC = (value) => {
	if (value) {
		const dateTime = new Date(value);
		const utcFromLocal = new Date(
			dateTime.getTime() + getTimezoneOffset(dateTime)
		);
		return utcFromLocal;
	} else return null;
};

const localToUTC = (dateTime) => {
	if (dateTime) {
		const utcFromLocal = new Date(
			dateTime.getTime() - getTimezoneOffset(dateTime)
		);
		return utcFromLocal;
	} else return null;
};

export default FieldValueDateComponent;
