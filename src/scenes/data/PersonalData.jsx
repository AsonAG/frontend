import { Box } from "@mui/material";
import { React } from "react";
import { useContext } from "react";
import { UserEmployeeContext } from "../../App";
import Header from "../../components/Header";
import CasesTable from "../global/CasesTable";

const PersonalData = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <Box m="25px">
      <Header title="My profile details" />

      <CasesTable
        employeeId={userEmployee.employeeId}
        caseType={"Employee"}
        clusterName={"EmployeeData"}
        navigateTo={"/personalDataCase"}
      />
    </Box>
  );
};

export default PersonalData;
