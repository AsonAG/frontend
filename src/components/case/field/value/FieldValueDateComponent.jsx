import { DatePicker, DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useContext, useRef } from "react";
import { FieldContext } from "../EditFieldComponent";
import { useRouteLoaderData } from "react-router-dom";
import { getDateLocale } from "../../../../services/converters/DateLocaleExtractor";

function _InternalDateComponent({Picker, propertyName = "value", displayName, sx, size = "medium", required}) {
	const { user } = useRouteLoaderData('root');
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
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getDateLocale(user)}>
			<Picker
				label={displayName}
				value={value}
				onChange={handleDateChange}
				name={field.name}
				timezone="UTC"
				disabled={isReadonly}
				inputRef={inputRef}
				slotProps={{
					textField: { required, size },
					openPickerButton: { tabIndex: -1 }
				}}
				sx={sx}
			/>
		</LocalizationProvider>
	);
};

function FieldValueDateComponent(props) { return _InternalDateComponent({Picker: DatePicker, ...props}); }
function FieldValueDateTimeComponent(props) { return _InternalDateComponent({Picker: DateTimePicker, ...props}); }



export { FieldValueDateComponent, FieldValueDateTimeComponent };
