import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../../components/Header";
import CasesTable from "../../global/CasesTable";

const CompanyData = () => {

  return (
    <Box m="25px">
      <Header title="COMPANY DATA" />
      <CasesTable
        caseType={"Company"}
        clusterName={"CompanyData"}
        navigateTo={"/companyData"}
      />
    </Box>
  );
};

export default CompanyData;
