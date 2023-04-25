import { Box } from "@mui/material";
import CasesTable from "../../global/CasesTable";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";

const EmployeeCases = () => {
  const employee = JSON.parse(window.sessionStorage.getItem("employee"));

  return (
    <Box m="25px">
      <Header   
          title={ employee?.firstName + ' ' + employee?.lastName }
          subtitle={ employee?.divisions?.join(", ") }
      />
      <CasesTable 
          caseType={'Employee'}
          employee={employee}    
          navigateTo={'/employeeCase'}
      />
    </Box>
  );
};

export default EmployeeCases;
