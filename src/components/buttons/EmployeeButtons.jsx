import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { React } from "react";
import { tokens } from "../../theme";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CasesOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Link } from "react-router-dom";

export const EmployeeButtons = (params) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClick = () => {
    params.setEmployeeChoice(params.employee);
  };

  return (
    <Box
      sx={{
        "& .employee-icon-button": {
          color: colors.primary[300],
        },
        "& .employee-icon-button:hover": {
          color: colors.blueAccentReverse + "!important",
        },
      }}
    >
      <EmployeeButton
        title={"New event"}
        onClick={handleClick}
        to={"/employee"}
      >
        <AddOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton title={"Data"} onClick={handleClick} to={"/employeeData"}>
        <CasesOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton
        title={"Events"}
        onClick={handleClick}
        to="/employeeEvents"
      >
        <WorkHistoryOutlinedIcon />
      </EmployeeButton>

      <EmployeeButton
        title={"Documents"}
        onClick={handleClick}
        to="/employeeDocuments"
      >
        <DescriptionOutlinedIcon />
      </EmployeeButton>
    </Box>
  );
};
const EmployeeButton = ({ title, onClick, to, children }) => {
  return (
    <Tooltip title={title} placement="top" arrow size="sm"
      className="employee-icon-button"
    >
      <IconButton
        onClick={onClick}
        component={Link}
        to={to}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};
