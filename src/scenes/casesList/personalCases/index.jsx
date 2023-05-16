import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import { Box } from "@mui/material";
import Header from "../../../components/Header";
import CasesTable from "../../global/CasesTable";
import { EmployeeContext, UserContext, UserEmployeeContext } from "../../../App";
import { useContext } from "react";

const PersonalCases = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <Box m="25px">
      <Header
        title="CASES"
        subtitle="Find what you want to report to the HR department"
      />
      <CasesTable
        employeeId={userEmployee.employeeId}
        caseType={"Employee"}
        clusterName={"ESS"}
        navigateTo={"/personalCase"}
      />
    </Box>
  );
};

export default PersonalCases;
