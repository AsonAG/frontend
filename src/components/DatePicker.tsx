import { DatePicker as MuiDatePicker, DateTimePicker as MuiDateTimePicker, LocalizationProvider, DatePickerProps as MuiDatePickerProps, DateTimePickerProps as MuiDateTimePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouteLoaderData } from "react-router-dom";
import { getDateLocale } from "../services/converters/DateLocaleExtractor";
import { InputAdornment, InputAdornmentProps, IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import React, { MouseEventHandler } from "react";
import { Dayjs } from 'dayjs';

type DatePickerInputAdornmentProps = {
  handleBack: MouseEventHandler,
  handleForward: MouseEventHandler,
} & InputAdornmentProps;

function DatePickerInputAdornment({children, handleBack, handleForward, ...props} : DatePickerInputAdornmentProps) {
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
  variant: "standard" |  "month" | "year"
}
interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
  variant: "datetime"
}

type DatePickerVariants = "standard" | "datetime" | "month" | "year";

type Props<T> = T extends "datetime" ? DateTimePickerProps : DatePickerProps;

export function DatePicker<T extends DatePickerVariants>({ variant, slots, slotProps, ...datePickerProps } : Props<T>) {
	const { user } = useRouteLoaderData('root') as any;
  const Picker = variant === "datetime" ? MuiDateTimePicker : MuiDatePicker;
  let pickerProps = {};
	if (variant === "month") {
		const { value, onChange } = datePickerProps;
    const setNewValue = (v: Dayjs | null | undefined) => {
      if (!v || !onChange) return;
      onChange(v, {validationError: null});
    }
    slots = {
      ...slots,
      // @ts-ignore
      inputAdornment: DatePickerInputAdornment
    };
    slotProps = {
      ...slotProps,
      inputAdornment: {
        // @ts-ignore
  			handleBack: () => setNewValue(value?.subtract(1, "month")),
  			handleForward: () => setNewValue(value?.add(1, "month"))
      }
    }
    pickerProps = {
      views: ["year", "month"],
      openTo: "month"
    }
	}
	if (variant === "year") {
		pickerProps = {
			views: ["year"]
		}
	}
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getDateLocale(user)}>
			<Picker
				{...datePickerProps}
        {...pickerProps}
				timezone="UTC"
        // @ts-ignore
				slots={slots}
        // @ts-ignore
				slotProps={slotProps}
			/>
		</LocalizationProvider>
	);
}
