import { Box } from "@mui/material";
import CasesTable from "../../components/tables/CasesTable";
import EmployeeHeader from "../../components/EmployeeHeader";
import { useSessionStorage } from "usehooks-ts";
import { useContext } from "react";
import { EmployeeSelectionContext, UserEmployeeContext } from "../../App";
import DocumentsTable from "../../components/tables/DocumentsTable";

const PersonalDocuments = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return userEmployee && (
    <Box m="25px">
      <EmployeeHeader employee={userEmployee} />

      <DocumentsTable 
          employeeId={userEmployee.employeeId}
          caseType={"Employee"}
          // clusterName={"EmployeeData"}
      />
    </Box>
  );
};

export default PersonalDocuments;
