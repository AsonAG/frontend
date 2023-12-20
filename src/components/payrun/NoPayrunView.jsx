import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function NoPayrunView() {
  const { t } = useTranslation();
  return <Typography>{t("No payrun defined")}</Typography>
}
