import { Checkbox, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

type CaseReasonProps = {
	reason: string;
	setReason: (reason: string) => void;
};
export function CaseReason({ reason, setReason }: CaseReasonProps) {
	const { t } = useTranslation();
	return (
		<Stack direction="row" flex={1}>
			<TextField
				value={reason}
				onChange={(event) => setReason(event.target.value)}
				label={t("Reason")}
				sx={{ minWidth: 200 }}
			/>
		</Stack>
	);
}
