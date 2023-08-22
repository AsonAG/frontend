import { Box } from "@mui/material";
import EmployeeHeader from "../../components/EmployeeHeader";
import { useContext } from "react";
import { UserEmployeeContext } from "../../App";
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
