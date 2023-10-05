import { Stack } from "@mui/material";
import { React } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useTranslation } from "react-i18next";
import { TableButton } from "./TableButton";

export function EmployeeButtons ({ employeeId, variant }) {
  const { t } = useTranslation();

  const stackSpacing = variant === "dense" ? 1 : 2;

  return (
    <Stack direction="row" spacing={stackSpacing}>
      <TableButton title={t("New event")} to={employeeId + "/new"} variant={variant} icon={<AddOutlinedIcon />} />
      <TableButton title={t("Events")} to={employeeId + "/events"} variant={variant} icon={<WorkHistoryOutlinedIcon />} />
      <TableButton title={t("Documents")} to={employeeId + "/documents"} variant={variant} icon={<DescriptionOutlinedIcon />} />
    </Stack>
  );
};