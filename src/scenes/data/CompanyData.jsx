import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import CasesTable from "../../components/tables/CasesTable";

const CompanyData = () => {

  return (
    <Box m="25px">
      <Header title="Company Data" />
      <CasesTable
        caseType={"Company"}
        clusterName={"CompanyData"}
        navigateTo={"/companyDataCase"}
      />
    </Box>
  );
};

export default CompanyData;
