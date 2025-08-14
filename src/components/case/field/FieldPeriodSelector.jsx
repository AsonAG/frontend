import { useTranslation } from "react-i18next";
import {
  FieldValueDateComponent,
  getDatePickerVariant,
} from "./value/FieldValueDateComponent";
import { useAccountingPeriodDateLimit } from "../useAccountingPeriodDateLimit";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";

dayjs.extend(utc);

export function FieldPeriodSelector({ field }) {
  const { t } = useTranslation();

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

  const startPickerProps = useAccountingPeriodDateLimit({
    picker: "start",
    start: startValue,
    end: endValue,
  });
  const endPickerProps = useAccountingPeriodDateLimit({
    picker: "end",
    start: startValue,
    end: endValue,
  });

  if (
    field.timeType === "Timeless" ||
    field.attributes?.["input.hideStartEnd"]
  ) {
    return null;
  }

  return (
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
        {...startPickerProps}
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
          {...endPickerProps}
        />
      )}
    </>
  );
}
