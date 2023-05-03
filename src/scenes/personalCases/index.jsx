import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import CasesTable from "../global/CasesTable";
import { EmployeeContext, UserContext } from "../../App";
import { useContext } from "react";

const PersonalCases = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Box m="25px">
      <Header
        title="Cases"
        subtitle="Find what you want to report to the HR department"
      />
      <CasesTable
        employee={user.employee}
        caseType={"Employee"}
        clusterName={"ESS"}
        navigateTo={"/personalCase"}
      />
    </Box>
  );
};

export default PersonalCases;
