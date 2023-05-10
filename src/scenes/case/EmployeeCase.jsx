import { Box } from "@mui/material";
import { React, useContext } from "react";
import CasesForm from "../global/CasesForm";
import EmployeeHeader from "../../components/EmployeeHeader";
import { EmployeeSelectionContext } from "../../App";

const EmployeeCase = () => {
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);

  return (
    <Box m="25px" display="flex" flexDirection="column" >
      <EmployeeHeader employee={employee} />
      
      <CasesForm 
        employee={employee} 
        navigateTo={"/employee"}/>
    </Box>
  );
};

export default EmployeeCase;
