import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import CasesTable from "../global/CasesTable";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const PersonalCases = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Cases"
          subtitle="Find what you want to report to the HR department"
        />
      </Box>
      <CasesTable
        caseType={"Employee"}
        clusterName={"ESS"}
        navigateTo={'/personalCase'}
      />
    </Box>
  );
};

export default PersonalCases;
