import { useTranslation } from "react-i18next";
import { FieldValueDateComponent } from "./value/FieldValueDateComponent";

export function FieldPeriodSelector({ field }) {
	const { t } = useTranslation();
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
				displayName={t("Start")}
				required={!field.optional}
			/>
			{field.timeType !== "Moment" && (
				<FieldValueDateComponent
					propertyName="end"
					displayName={t("End")}
					required={!field.optional && field.endMandatory}
				/>
			)}
		</>
	);

	return periodPickers;
}
