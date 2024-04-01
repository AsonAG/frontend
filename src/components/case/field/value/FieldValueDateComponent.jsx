import dayjs from "dayjs";
import { useContext, useRef, useEffect } from "react";
import { FieldContext } from "../Field";
import { DatePicker } from "../../../DatePicker";
import { useTranslation } from "react-i18next";

export function FieldValueDateComponent({variant = "standard", propertyName = "value", displayName, required}) {
	const { t } = useTranslation();
	const { field, isReadonly, required: fieldRequired, buildCase, displayName: fieldDisplayName } = useContext(FieldContext);
	const inputRef = useRef();
	const fieldValue = field[propertyName];
	const value = fieldValue ? dayjs.utc(fieldValue) : null;
	required ??= fieldRequired;
	displayName ??= fieldDisplayName;

	const handleDateChange = (newDate, context) => {
		const validationError = context.validationError ? t("Invalid date") : "";
		
		inputRef.current?.setCustomValidity(validationError);
		if(!validationError) {
			field[propertyName] = newDate?.toISOString();
			buildCase();
		}
	};

	// We need to set the validity ourselves, because the MUI Datepicker
	// populates the input field with a placeholder.
	// The default HTML Form validation error message won't display because of that.
	useEffect(() => {
    if (!required) {
      inputRef.current?.setCustomValidity("");
      return;
    }
		const validationError = !value ? t("Please enter a date") : "";
		inputRef.current?.setCustomValidity(validationError);
	}, [value, inputRef.current, required]);

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
