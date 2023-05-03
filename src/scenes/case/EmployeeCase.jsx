import { Box } from "@mui/material";
import { React } from "react";
import CasesForm from "../global/CasesForm";
import EmployeeHeader from "../../components/EmployeeHeader";
import { useSessionStorage } from "usehooks-ts";

const EmployeeCase = () => {
  // const caseName = window.sessionStorage.getItem("caseName");
  // const caseDetails = window.sessionStorage.getItem("caseDetails");

  // const employee = JSON.parse(window.sessionStorage.getItem("employee"));
  const [employee, setEmployee] = useSessionStorage('employee', {});


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
