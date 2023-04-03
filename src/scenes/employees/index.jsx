import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import CasesTable from "../../components/CasesTable";

const Employees = ({updateCaseName}) => {
  return (
    <Box m="25px">
      <Header title="COMPANY CASES" subtitle="Choose a case" />
      <CasesTable updateCaseName={updateCaseName} caseType={'Company'}/>
    </Box>
  );
};

export default Employees;
