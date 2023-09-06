import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const FieldValueDateComponent = (
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

	const handleDateChange = (newDate) => {
		setDateValue(newDate);
		onChange(newDate.format());
	};

	return (
		<DatePicker
			label={fieldDisplayName + (required && !caseIsReadOnly ? "*" : "")}
			value={dateValue}
			onChange={handleDateChange}
			name={fieldKey}
			timezone="UTC"
			key={fieldKey}
			disabled={caseIsReadOnly}
			slotProps={{ ...slotInputProps }}
			views={["year", "month", "day"]}
		/>
	);
};

export default FieldValueDateComponent;
