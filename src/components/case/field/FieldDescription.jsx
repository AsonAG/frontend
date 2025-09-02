import { useContext } from "react";
import { Tooltip, styled, Stack } from "@mui/material";
import { Info, History } from "@mui/icons-material";
import { FieldContext } from "./Field";
import { useTranslation } from "react-i18next";
import { CaseFormContext } from "../../../scenes/global/CaseForm";
import { useIncrementallyLoadedData } from "../../../hooks/useIncrementallyLoadedData";

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
		cursor: "pointer",
	}),
);

export function FieldDetails() {
	const { setCaseFieldDetails } = useContext(CaseFormContext);
	const { field } = useContext(FieldContext);
	const { t } = useTranslation();

	const isHistorisable = field.timeType !== "Timeless";

	const { items } = useIncrementallyLoadedData(
		`history/${encodeURIComponent(field.name)}`,
		1
	);

	const hasAnyHistory = Array.isArray(items) && items.length > 0;

	const showDescription = !!field.description;
	const showHistory = isHistorisable && hasAnyHistory;

	if (field.attributes["input.hidden"]) {
		return null;
	}

	if (!showDescription && !showHistory) {
		return null;
	}

	return (
		<Stack direction="row" spacing={1}>
			{ }
			{showDescription && (
				<Tooltip arrow title={t("Description")} placement="right">
					<ButtonBox
						type="button"
						tabIndex={-1}
						onClick={() =>
							setCaseFieldDetails({ field, focus: "description" })
						}
					>
						<Info />
					</ButtonBox>
				</Tooltip>
			)}

			{ }
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
