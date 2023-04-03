import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import EmployeesTable from "./EmployeesTable";

const Employees = ({ updateCaseName }) => {
  return (
    <Box m="25px">
      <Header
        title="EMPLOYEES"
        subtitle="Choose an employee and proceed with employee case"
      />
      <EmployeesTable updateCaseName={updateCaseName} />
    </Box>
  );
};

export default Employees;
