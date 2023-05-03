import { Box } from "@mui/material";
import CasesTable from "../../global/CasesTable";
import EmployeeHeader from "../../../components/EmployeeHeader";
import { useSessionStorage } from "usehooks-ts";

const EmployeeCases = () => {
  // const employee = JSON.parse(window.sessionStorage.getItem("employee"));
  const [employee, setEmployee] = useSessionStorage('employee', {});

  return employee && (
    <Box m="25px">
      <EmployeeHeader employee={employee} />
      <CasesTable 
          caseType={'Employee'}
          employee={employee}    
          navigateTo={'/employeeCase'}
      />
    </Box>
  );
};

export default EmployeeCases;
