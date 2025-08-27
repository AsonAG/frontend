import { DateValidationError } from "@mui/x-date-pickers";
import { unwrap } from "jotai/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { payrollAtom } from "../../utils/dataAtoms";
import { useAtomValue } from "jotai";
import dayjs from "dayjs";

const unwrappedPayrollAtom = unwrap(payrollAtom, (prev) => prev ?? null);

export function useAccountingPeriodDateLimit() {
	const { t } = useTranslation();
	const [error, setError] = useState<DateValidationError | null>(null);
	const payroll = useAtomValue(unwrappedPayrollAtom);
	const minDate = useMemo(
		() => dayjs.utc(payroll?.accountingStartDate ?? "1900-01-01"),
		[payroll?.accountingStartDate],
	);

	const errorMessage = useMemo(() => {
		if (error === "minDate") {
			return t("date_accounting_start_date_validation", {
				accountingStartDate: minDate.format("L"),
			});
		}
		return "";
	}, [error]);

	return {
		minDate,
		minDateErrorMessage: errorMessage,
		onError: setError,
	};
}
