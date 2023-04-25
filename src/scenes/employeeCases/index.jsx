import { Box } from "@mui/material";
import CasesTable from "../global/CasesTable";
import Header from "../../components/Header";

const EmployeeCases = () => {
  const employee = window.sessionStorage.getItem("employee"); //todo

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
