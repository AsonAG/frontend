import {
	DateValidationError,
	DateTimeValidationError,
} from "@mui/x-date-pickers";
import { unwrap } from "jotai/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { payrollAtom } from "../../utils/dataAtoms";
import { useAtomValue } from "jotai";
import dayjs, { Dayjs } from "dayjs";

type Options = {
	picker: "start" | "end";
	start: Dayjs | null;
	end: Dayjs | null;
};

const unwrappedPayrollAtom = unwrap(payrollAtom, (prev) => prev ?? null);

export function usePeriodDateLimit({ picker, start, end }: Options) {
	const { t } = useTranslation();
	const payroll = useAtomValue(unwrappedPayrollAtom);

	const baseMin = useMemo(
		() => dayjs.utc(payroll?.accountingStartDate ?? "1900-01-01"),
		[payroll?.accountingStartDate],
	);

	const minDate = useMemo(() => {
		if (picker === "end" && start) {
			return start.isAfter(baseMin) ? start : baseMin;
		}
		return baseMin;
	}, [picker, start, baseMin]);

	const maxDate = useMemo<Dayjs | undefined>(() => {
		if (picker === "start" && end) return end;
		return undefined;
	}, [picker, end]);

	const getValidationErrorMessage = (
		error: DateValidationError | DateTimeValidationError | null | undefined,
	): string | undefined => {
		if (error === "minDate") {
			const startIsEffectiveMin =
				picker === "end" && start && start.isAfter(baseMin);

			if (startIsEffectiveMin) {
				return t("date_start_before_end_validation", {});
			}
			return t("date_accounting_start_date_validation", {
				accountingStartDate: baseMin.format("L"),
			});
		}
		if (error === "maxDate") {
			return t("date_start_before_end_validation", {});
		}
		return undefined;
	};

	return {
		minDate,
		maxDate,
		getValidationErrorMessage,
	};
}
