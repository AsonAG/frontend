import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useContext, useRef } from "react";
import { FieldContext } from "../FieldComponent";

function _InternalDateComponent({Picker, propertyName, displayName, sx, required = true}) {
	const { field, isReadonly, buildCase, displayName: fieldDisplayName } = useContext(FieldContext);
	const inputRef = useRef();
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;

	displayName ??= fieldDisplayName;

	const handleDateChange = (newDate, context) => {
		const validationError = context.validationError ? "Invalid date" : "";
		inputRef.current?.setCustomValidity(validationError);
		if(!validationError) {
			field[propertyName] = newDate?.format();
			buildCase();
		}
	};

	return (
		<Picker
			label={displayName}
			value={value}
			onChange={handleDateChange}
			name={field.name}
			timezone="UTC"
			disabled={isReadonly}
			views={["year", "month", "day"]}
			inputRef={inputRef}
			slotProps={{
				field: { required },
				openPickerButton: { tabIndex: -1 }
			}}
			sx={sx}
		/>
	);
};

function FieldValueDateComponent(props) { return _InternalDateComponent({Picker: DatePicker, ...props}); }
function FieldValueDateTimeComponent(props) { return _InternalDateComponent({Picker: DateTimePicker, ...props}); }



export { FieldValueDateComponent, FieldValueDateTimeComponent };
