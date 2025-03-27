import { useTranslation } from "react-i18next";
import { FieldValueDateComponent, getDatePickerVariant } from "./value/FieldValueDateComponent";
import { useAccountingPeriodDateLimit } from "../useAccountingPeriodDateLimit";

export function FieldPeriodSelector({ field }) {
	const { t } = useTranslation();
	const startPickerProps = useAccountingPeriodDateLimit();
	const endPickerProps = useAccountingPeriodDateLimit();
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
				variant={getDatePickerVariant(field.attributes?.["input.datePickerStart"], undefined, "month-short")}
				displayName={t("Start")}
				required={!field.optional}
				{...startPickerProps}
			/>
			{field.timeType !== "Moment" && (
				<FieldValueDateComponent
					propertyName="end"
					variant={getDatePickerVariant(field.attributes?.["input.datePickerEnd"], undefined, "month-short")}
					displayName={t("End")}
					required={!field.optional && field.endMandatory}
					{...endPickerProps}
				/>
			)}
		</>
	);

	return periodPickers;
}
