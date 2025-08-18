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
import React, { MouseEventHandler, useRef, useState } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

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

interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
	variant: "standard" | "month" | "month-short" | "year";
	required?: boolean;
}
interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
	variant: "datetime";
	required?: boolean;
}

type DatePickerVariants = "standard" | "datetime" | "month" | "year";

type Props<T> = (T extends "datetime"
	? DateTimePickerProps
	: DatePickerProps) & {
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
	const [localValue, setLocalValue] = useState<Dayjs | null>(value ?? null);
	const lastValidationError = useRef<
		DateValidationError | DateTimeValidationError | null
	>(null);

	const handleDateChange = (
		newDate: Dayjs | null,
		context: PickerChangeHandlerContext<
			DateValidationError | DateTimeValidationError
		>,
	) => {
		setLocalValue(newDate);
		lastValidationError.current = context.validationError;
	};

	const handleBlur = () => {
		const isValid = !localValue || localValue.isValid();
		const err = lastValidationError.current;
		let message: string | undefined;

		if (getValidationErrorMessage) {
			message = getValidationErrorMessage(err);
		}
		if (!message && err) {
			message = getValidationError({
				validationError: err,
			});
		}

		if (inputRef.current) {
			if (message) {
				inputRef.current.setCustomValidity(t(message));
			} else if (!required) {
				inputRef.current.setCustomValidity("");
			} else if (!localValue) {
				inputRef.current.setCustomValidity(t("Please enter a date"));
			} else {
				inputRef.current.setCustomValidity("");
			}
		}

		if (isValid && onChange) {
			// @ts-ignore
			onChange(localValue);
		}
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
				if (!v || !onChange) return;
				handleDateChange(v, { validationError: null });
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
			onChange={handleDateChange}
			// @ts-ignore
			slots={slots}
			// @ts-ignore
			slotProps={slotProps}
		/>
	);
}

type GetValidationErrorProps = {
	validationError:
		| DateTimeValidationError
		| DateValidationError
		| null
		| undefined;
};

function getValidationError({ validationError }: GetValidationErrorProps) {
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
