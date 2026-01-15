import {
	DatePicker as MuiDatePicker,
	DateTimePicker as MuiDateTimePicker,
	DatePickerProps as MuiDatePickerProps,
	DateTimePickerProps as MuiDateTimePickerProps,
	DateValidationError,
	PickerChangeHandlerContext,
	DateTimeValidationError,
} from "@mui/x-date-pickers";
import { InputAdornment, InputAdornmentProps, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import type {} from "@mui/x-date-pickers/AdapterDayjs";

type DatePickerInputAdornmentProps = {
	handleBack: MouseEventHandler;
	handleForward: MouseEventHandler;
	disabled?: boolean;
} & InputAdornmentProps;

function DatePickerInputAdornment({
	children,
	handleBack,
	handleForward,
	disabled,
	...props
}: DatePickerInputAdornmentProps) {
	return (
		<InputAdornment {...props}>
			<IconButton onClick={handleBack} disabled={disabled}>
				<NavigateBefore />
			</IconButton>
			<IconButton onClick={handleForward} disabled={disabled}>
				<NavigateNext />
			</IconButton>
			{children}
		</InputAdornment>
	);
}

type DatePickerVariants =
	| "standard"
	| "datetime"
	| "month"
	| "year"
	| "month-short";

type DatePickerProps = Omit<MuiDatePickerProps<Dayjs>, "onChange">;
type DateTimePickerProps = Omit<MuiDateTimePickerProps<Dayjs>, "onChange">;

type Props<T> = (T extends "datetime"
	? DateTimePickerProps
	: DatePickerProps) & {
	variant: DatePickerVariants;
	required?: boolean;
	onChange: (value: Dayjs | null) => void;
	getValidationErrorMessage?: (
		error: DateValidationError | DateTimeValidationError | null | undefined,
	) => string | undefined;
};

export function DatePicker<T extends DatePickerVariants>({
	variant,
	slots,
	slotProps,
	required = false,
	onChange,
	getValidationErrorMessage,
	...datePickerProps
}: Props<T>) {
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const Picker = variant === "datetime" ? MuiDateTimePicker : MuiDatePicker;
	let pickerProps = {};
	const { value } = datePickerProps;
	const [localValue, setLocalValue] = useState<Dayjs | null>(null);

	useEffect(
		() => updateLocalState(value ?? null, { validationError: null }),
		[value],
	);

	const handleChange = (v: Dayjs | null | undefined) => {
		if (!onChange) return;

		if (!v) {
			onChange(null);
			return;
		}

		var hasError = inputRef.current?.validity.customError == true;
		if (v.isValid() && !hasError) {
			onChange(v);
		}
	};

	const updateLocalState = (
		newDate: Dayjs | null,
		context: PickerChangeHandlerContext<
			DateValidationError | DateTimeValidationError
		>,
	) => {
		setLocalValue(newDate);
		var err = context.validationError;
		let message: string | undefined;
		if (getValidationErrorMessage) {
			message = getValidationErrorMessage(err);
		}
		if (!message && err) {
			message = getDefaultValidationErrorMessage(err);
		}

		if (inputRef.current) {
			if (message) {
				inputRef.current.setCustomValidity(t(message));
			} else if (!required) {
				inputRef.current.setCustomValidity("");
			} else if (!newDate) {
				inputRef.current.setCustomValidity(t("Please enter a date"));
			} else {
				inputRef.current.setCustomValidity("");
			}
		}
	};

	const handleBlur = () => {
		handleChange(localValue);
	};

	slotProps = {
		...slotProps,
		textField: {
			...slotProps?.textField,
			required,
			inputRef,
			onBlur: handleBlur,
		},
		openPickerButton: { tabIndex: -1 },
	};

	if (variant === "month" || variant === "month-short") {
		pickerProps = {
			views: ["year", "month"],
			openTo: "month",
		};

		if (variant !== "month-short") {
			const setNewValue = (v: Dayjs | null | undefined) => {
				if (!v) return;
				updateLocalState(v, { validationError: null });
				handleChange(v);
			};
			slots = {
				...slots,
				// @ts-ignore
				inputAdornment: DatePickerInputAdornment,
			};

			slotProps = {
				...slotProps,
				inputAdornment: {
					// @ts-ignore
					handleBack: () => setNewValue(localValue?.subtract(1, "month")),
					handleForward: () => setNewValue(localValue?.add(1, "month")),
					disabled: datePickerProps.disabled,
				},
			};
		} else {
			// @ts-ignore
			pickerProps.format = "MMM YYYY";
		}
	}

	if (variant === "year") {
		pickerProps = { views: ["year"] };
	}

	return (
		<Picker
			{...datePickerProps}
			{...pickerProps}
			value={localValue}
			inputRef={inputRef}
			timezone="UTC"
			onChange={updateLocalState}
			onAccept={(v: Dayjs | null, context) => {
				updateLocalState(v, context);
				handleChange(v);
			}}
			// @ts-ignore
			slots={slots}
			// @ts-ignore
			slotProps={slotProps}
		/>
	);
}

function getDefaultValidationErrorMessage(
	validationError: DateTimeValidationError | DateValidationError | null,
): string {
	if (validationError === "minDate") {
		return "Date is not in the valid range.";
	}
	if (validationError === "maxDate") {
		return "Date is not in the valid range.";
	}
	if (validationError) {
		return "Invalid date";
	}
	return "";
}
