import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const FieldValueDateTimeComponent = (
	fieldDisplayName,
	required,
	fieldValue,
	onChange,
	fieldKey,
	slotInputProps,
	caseIsReadOnly
) => {
	const [dateValue, setDateValue] = useState(dayjs.utc(fieldValue));

	useEffect(() => {
		setDateValue(dayjs.utc(fieldValue));
	}, [fieldValue]);

	const handleDateTimeChange = (newDate) => {
		setDateValue(newDate);
		onChange(newDate.format());
	};

	return (
		<DateTimePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleDateTimeChange}
			timezone="UTC"
			name={fieldKey}
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
		/>
	);
};

export default FieldValueDateTimeComponent;
