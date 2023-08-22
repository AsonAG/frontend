import { Box } from "@mui/material";
import EmployeeHeader from "../../components/EmployeeHeader";
import { useContext } from "react";
import { EmployeeSelectionContext } from "../../App";
import DocumentsTable from "../../components/tables/DocumentsTable";

const EmployeeDocuments = () => {
  // const employee = JSON.parse(window.sessionStorage.getItem("employee"));
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);

  return employee && (
    <Box m="25px">
      <EmployeeHeader employee={employee} />
      <DocumentsTable 
          caseType={'Employee'}
          employeeId={employee.employeeId}    
      />
    </Box>
  );
};

export default EmployeeDocuments;
