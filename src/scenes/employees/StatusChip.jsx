import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

export function StatusChip({ status }) {
	const { t } = useTranslation();
	const color = status === "Active" ? "success" : undefined;
	return <Chip label={t(status)} size="small" color={color} />;
}
