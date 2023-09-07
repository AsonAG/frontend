import { Box, IconButton, Tooltip } from "@mui/material";
import { React } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Link } from "react-router-dom";

export const EmployeeButtons = ({employeeId}) => {

  return (
    <Box>
      <EmployeeButton title={"New event"} to={employeeId + "/new"}>
        <AddOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={"Data"} to={employeeId + ""}>
        <PersonOutlineOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={"Events"}to={employeeId + "/events"}>
        <WorkHistoryOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={"Documents"} to={employeeId + "/documents"}>
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
