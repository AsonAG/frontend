import { Box } from "@mui/material";
import { React } from "react";
import { useContext } from "react";
import { UserEmployeeContext } from "../../../App";
import Header from "../../../components/Header";
import CasesTable from "../../global/CasesTable";

const EmployeeData = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <Box m="25px">
      <Header title="MY PROFILE DETAILS" />
      <CasesTable
        employeeId={userEmployee.employeeId}
        caseType={"Employee"}
        clusterName={"EmployeeData"}
        navigateTo={"/employeeDataCase"}
      />
    </Box>
  );
};

export default EmployeeData;
