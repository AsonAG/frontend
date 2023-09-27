import { Box, IconButton, Tooltip } from "@mui/material";
import { React } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const EmployeeButtons = ({employeeId}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <EmployeeButton title={t("New event")} to={employeeId + "/new"}>
        <AddOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={t("Data")} to={employeeId + ""}>
        <PersonOutlineOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={t("Events")}to={employeeId + "/events"}>
        <WorkHistoryOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={t("Documents")} to={employeeId + "/documents"}>
        <DescriptionOutlinedIcon />
      </EmployeeButton>
    </Box>
  );
};
const EmployeeButton = ({ title, to, children }) => {
  return (
    <Tooltip title={title} placement="top" arrow size="sm">
      <IconButton component={Link} to={to}>
        {children}
      </IconButton>
    </Tooltip>
  );
};
