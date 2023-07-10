import { Box } from "@mui/material";
import CasesTable from "../../components/tables/CasesTable";
import EmployeeHeader from "../../components/EmployeeHeader";
import { useSessionStorage } from "usehooks-ts";
import { useContext } from "react";
import { EmployeeSelectionContext } from "../../App";

const EmployeeDocuments = () => {
  // const employee = JSON.parse(window.sessionStorage.getItem("employee"));
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);

  return employee && (
    <Box m="25px">
      <EmployeeHeader employee={employee} />
      <CasesTable 
          caseType={'Employee'}
          employeeId={employee.employeeId}    
      />
    </Box>
  );
};

export default EmployeeDocuments;
