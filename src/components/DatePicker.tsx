import {
	DatePicker as MuiDatePicker,
	DateTimePicker as MuiDateTimePicker,
	LocalizationProvider,
	DatePickerProps as MuiDatePickerProps,
	DateTimePickerProps as MuiDateTimePickerProps,
	DateValidationError,
	PickerChangeHandlerContext,
	DateTimeValidationError,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouteLoaderData } from "react-router-dom";
import { getDateLocale } from "../services/converters/DateLocaleExtractor";
import { InputAdornment, InputAdornmentProps, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

type DatePickerInputAdornmentProps = {
	handleBack: MouseEventHandler;
	handleForward: MouseEventHandler;
} & InputAdornmentProps;

function DatePickerInputAdornment({
	children,
	handleBack,
	handleForward,
	...props
}: DatePickerInputAdornmentProps) {
	return (
		<InputAdornment {...props}>
			<IconButton onClick={handleBack}>
				<NavigateBefore />
			</IconButton>
			<IconButton onClick={handleForward}>
				<NavigateNext />
			</IconButton>
			{children}
		</InputAdornment>
	);
}

interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
	variant: "standard" | "month" | "year";
	required?: boolean;
}
interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
	variant: "datetime";
	required?: boolean;
}

type DatePickerVariants = "standard" | "datetime" | "month" | "year";

type Props<T> = T extends "datetime" ? DateTimePickerProps : DatePickerProps;

export function DatePicker<T extends DatePickerVariants>({
	variant,
	slots,
	slotProps,
	required = false,
	onChange,
	...datePickerProps
}: Props<T>) {
	const { user } = useRouteLoaderData("root") as any;
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement | null>();
	const Picker = variant === "datetime" ? MuiDateTimePicker : MuiDatePicker;
	let pickerProps = {};
	const { value } = datePickerProps;
	const handleDateChange = (
		newDate: Dayjs | null,
		context: PickerChangeHandlerContext<
			DateValidationError | DateTimeValidationError
		>,
	) => {
		const validationError = getValidationError(context.validationError, t);
		inputRef.current?.setCustomValidity(validationError);
		if (!validationError && onChange) {
			// @ts-ignore
			onChange(newDate);
		}
	};
	slotProps = {
		...slotProps,
		field: {
			...slotProps?.field,
			// @ts-ignore
			required,
		},
		openPickerButton: { tabIndex: -1 },
	};
	if (variant === "month") {
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
				handleBack: () => setNewValue(value?.subtract(1, "month")),
				handleForward: () => setNewValue(value?.add(1, "month")),
			},
		};
		pickerProps = {
			views: ["year", "month"],
			openTo: "month",
		};
	}
	if (variant === "year") {
		pickerProps = {
			views: ["year"],
		};
	}

	// We need to set the validity ourselves, because the MUI Datepicker
	// populates the input field with a placeholder.
	// The default HTML Form validation error message won't display because of that.
	useEffect(() => {
		if (!required) {
			inputRef.current?.setCustomValidity("");
			return;
		}
		const validationError = !value ? t("Please enter a date") : "";
		console.log(validationError);
		inputRef.current?.setCustomValidity(validationError);
	}, [value, inputRef.current, required]);

	return (
		<LocalizationProvider
			dateAdapter={AdapterDayjs}
			adapterLocale={getDateLocale(user)}
		>
			<Picker
				{...datePickerProps}
				{...pickerProps}
				inputRef={inputRef}
				timezone="UTC"
				onChange={handleDateChange}
				// @ts-ignore
				slots={slots}
				// @ts-ignore
				slotProps={slotProps}
			/>
		</LocalizationProvider>
	);
}

function getValidationError(validationError, t) {
	if (validationError === "minDate" || validationError === "maxDate")
		return t("Date is not in the valid range.");
	if (validationError) return t("Invalid date");
	return "";
}
