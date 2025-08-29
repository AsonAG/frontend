import { useContext } from "react";
import { Tooltip, styled, Stack } from "@mui/material";
import { Info, History } from "@mui/icons-material";
import { FieldContext } from "./Field";
import { useTranslation } from "react-i18next";
import { CaseFormContext } from "../../../scenes/global/CaseForm";

const ButtonBox = styled("button")(({ theme }) =>
	theme.unstable_sx({
		border: 1,
		borderRadius: 1,
		borderColor: theme.palette.inputBorder,
		width: 37,
		height: 37,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: theme.palette.text.secondary,
		backgroundColor: theme.palette.background.default,
		cursor: "pointer"
	}),
);

export function FieldDetails() {
	const { setCaseFieldDetails } = useContext(CaseFormContext);
	const { field } = useContext(FieldContext);
	const { t } = useTranslation();
	const showHistory = field.timeType !== "Timeless";

	if (field.attributes["input.hidden"]) {
		return null;
	}
	if (field.timeType === "Timeless" && !field.description) {
		return null;
	}

	return (
		<Stack direction="row" spacing={1}>
			{/* Alter Button: nur Beschreibung */}
			<Tooltip arrow title={t("Description")} placement="right">
				<ButtonBox
					type="button"
					tabIndex={-1}
					onClick={() => setCaseFieldDetails({ field, focus: "description" })}
				>
					<Info />
				</ButtonBox>
			</Tooltip>

			{/* Neuer Button: nur Verlauf (falls historisierbar) */}
			{showHistory && (
				<Tooltip arrow title={t("History")} placement="right">
					<ButtonBox
						type="button"
						tabIndex={-1}
						onClick={() => setCaseFieldDetails({ field, focus: "history" })}
					>
						<History />
					</ButtonBox>
				</Tooltip>
			)}
		</Stack>
	);
}
