import { Box } from "@mui/material";
import { React } from "react";
import CasesTable from "../../components/CasesTable";
import Header from "../../components/Header";

const EmployeeCases = ({ employee, updateCaseName }) => {
  return (
    <Box m="25px">
      <Header 
          title={ employee.firstName + ' ' + employee.lastName }
          subtitle={ "Employee divisions:" + employee.divisions.join(", ") }
      />
      <CasesTable 
          updateCaseName={updateCaseName} 
          caseType={'Employee'}
          employeeId={employee.employeeId}    
      />
    </Box>
  );
};

export default EmployeeCases;
