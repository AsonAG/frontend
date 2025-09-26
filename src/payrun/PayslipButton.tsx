import { IconButton, Tooltip } from "@mui/material";
import { PayrunPeriodEntry } from "../models/PayrunPeriod";
import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";

type PayslipButtonProps = {
	payrunPeriodEntry: PayrunPeriodEntry;
};
export function PayslipButton({ payrunPeriodEntry }: PayslipButtonProps) {
	const { t } = useTranslation();
	const generatingTooltip = t("Generating...");
	if (payrunPeriodEntry.state !== "Current") {
		return (
			<Tooltip title={generatingTooltip} placement="left">
				<span>
					<IconButton size="small" loading>
						<FilePresentRoundedIcon />
					</IconButton>
				</span>
			</Tooltip>
		);
	}
	const doc = payrunPeriodEntry.documents?.find(
		(doc) => doc.attributes?.type === "payslip",
	);
	if (!doc) return;
	return (
		<Tooltip key={doc.id} title={doc.name} placement="left">
			<span>
				<IconButton
					size="small"
					component={Link}
					to={`${payrunPeriodEntry.id}/doc/${doc.id}`}
					onClick={stopPropagation}
				>
					<FilePresentRoundedIcon />
				</IconButton>
			</span>
		</Tooltip>
	);
}
const stopPropagation: MouseEventHandler = (event) => event?.stopPropagation();
