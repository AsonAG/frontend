import {
	Checkbox,
	FormControl,
	FormControlLabel,
	TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type CaseReasonProps = {
	reason: string;
	setReason: (reason: string) => void;
	reasonCanBeIncludedInPayslip: boolean;
	includeReasonInPayslip: boolean;
	setIncludeReasonInPayslip: (include: boolean) => void;
};
export function CaseReason({
	reason,
	setReason,
	reasonCanBeIncludedInPayslip,
	includeReasonInPayslip,
	setIncludeReasonInPayslip,
}: CaseReasonProps) {
	const { t } = useTranslation();
	return (
		<>
			<TextField
				value={reason}
				onChange={(event) => setReason(event.target.value)}
				label={t("Reason")}
				sx={{ flex: 1, minWidth: 200 }}
			/>
			{reasonCanBeIncludedInPayslip && (
				<FormControl>
					<FormControlLabel
						label={t("Show reason in payslip")}
						labelPlacement="end"
						control={
							<Checkbox
								checked={includeReasonInPayslip}
								onChange={(event) =>
									setIncludeReasonInPayslip(event.target.checked)
								}
							/>
						}
					/>
				</FormControl>
			)}
		</>
	);
}
