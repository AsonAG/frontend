import { Box } from "@mui/material";
import CasesTable from "../../components/CasesTable";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

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
