import { useTranslation } from "react-i18next";
import {
	FieldValueDateComponent,
	getDatePickerVariant,
} from "./value/FieldValueDateComponent";
import { useAccountingPeriodDateLimit } from "../useAccountingPeriodDateLimit";
import dayjs from "dayjs";
import { useMemo } from "react";

export function FieldPeriodSelector({ field }) {
	const { t } = useTranslation();
	const startPickerProps = useAccountingPeriodDateLimit();
	const endPickerProps = useAccountingPeriodDateLimit();

	const startValue = useMemo(() => {
		const value = field?.start;
		if (!value) return null;
		try {
			return dayjs.utc(value);
		} catch {
			return null;
		}
	}, [field?.start]);

	const endValue = useMemo(() => {
		const value = field?.end;
		if (!value) return null;
		try {
			return dayjs.utc(value);
		} catch {
			return null;
		}
	}, [field?.end]);

	const computedStartPickerProps = useMemo(() => {
		const props = { ...startPickerProps };
		if (endValue) {
			props.maxDate = endValue;
		}
		return props;
	}, [startPickerProps, endValue]);

	const computedEndPickerProps = useMemo(() => {
		const props = { ...endPickerProps };
		if (startValue) {
			const baseMin = endPickerProps.minDate;
			if (baseMin) {
				props.minDate = startValue.isAfter(baseMin) ? startValue : baseMin;
			} else {
				props.minDate = startValue;
			}
		}
		return props;
	}, [endPickerProps, startValue]);

	if (
		field.timeType === "Timeless" ||
		field.attributes?.["input.hideStartEnd"]
	) {
		return null;
	}

	const periodPickers = (
		<>
			<FieldValueDateComponent
				propertyName="start"
				variant={getDatePickerVariant(
					field.attributes?.["input.datePickerStart"],
					undefined,
					"month-short",
				)}
				displayName={t("Start")}
				required={!field.optional}
				{...computedStartPickerProps}
			/>
			{field.timeType !== "Moment" && (
				<FieldValueDateComponent
					propertyName="end"
					variant={getDatePickerVariant(
						field.attributes?.["input.datePickerEnd"],
						undefined,
						"month-short",
					)}
					displayName={t("End")}
					required={!field.optional && field.endMandatory}
					{...computedEndPickerProps}
				/>
			)}
		</>
	);

	return periodPickers;
}
