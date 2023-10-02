import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { React } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function EmployeeButtons ({ employeeId, variant }) {
  const { t } = useTranslation();

  const stackProps = variant === "dense" ? 
    { spacing: 1 } :
    { spacing: 2, minWidth: 428 };

  return (
    <Stack direction="row" {...stackProps}>
      <EmployeeButton title={t("New event")} to={employeeId + "/new"} variant={variant}>
        <AddOutlinedIcon />
      </EmployeeButton>
      <EmployeeButton title={t("Events")}to={employeeId + "/events"} variant={variant}>
        <WorkHistoryOutlinedIcon />
      </EmployeeButton>
      <EmployeeButton title={t("Documents")} to={employeeId + "/documents"} variant={variant}>
        <DescriptionOutlinedIcon />
      </EmployeeButton>
    </Stack>
  );
};
function EmployeeButton({ title, to, children, variant }) {
  if (variant === "dense") {
    return (
      <Tooltip title={title} placement="top" arrow size="sm">
        <IconButton component={Link} to={to} color="primary">
          {children}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button component={Link} to={to} variant="outlined" startIcon={children}>
      <Typography>{title}</Typography>
    </Button>
  );
  
};
