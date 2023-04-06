import { Box } from "@mui/material";
import { useContext } from "react";
import CasesTable from "../../components/CasesTable";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";

const EmployeeCases = ({ updateCaseName }) => {
  const { employeeChoice: employee, setEmployeeChoice } = useContext(EmployeeContext);

  return (
    <Box m="25px">
      <Header 
          title={ employee.firstName + ' ' + employee.lastName }
          subtitle={ employee.divisions.join(", ") }
      />
      <CasesTable 
          updateCaseName={updateCaseName} 
          caseType={'Employee'}
          employee={employee}    
      />
    </Box>
  );
};

export default EmployeeCases;
