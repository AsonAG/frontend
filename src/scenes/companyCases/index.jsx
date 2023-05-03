import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import CasesTable from "../global/CasesTable";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const CompanyCases = () => {
  return (
    <Box m="25px">
      <Header title="COMPANY CASES" subtitle="Choose a case" />
      <CasesTable caseType={"Company"} navigateTo={"/companyCase"} />
    </Box>
  );
};

export default CompanyCases;
