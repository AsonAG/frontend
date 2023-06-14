import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import EmployeesTable from "./EmployeesTable";

const Employees = () => {
  return (
    <Box m="25px">
      <Header
        title="Employees"
        subtitle="Choose an employee and proceed with employee case"
      />
      <EmployeesTable />
    </Box>
  );
};

export default Employees;
