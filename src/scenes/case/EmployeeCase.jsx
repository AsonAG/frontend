import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";

const EmployeeCase = () => {
  // const caseName = window.sessionStorage.getItem("caseName");
  // const caseDetails = window.sessionStorage.getItem("caseDetails");
  const employee = JSON.parse(window.sessionStorage.getItem("employee"));

  return (
    <Box m="25px" display="flex" flexDirection="column" >
        {/* <Header
          title={caseName}
          subtitle={caseDetails}
        /> */}
      <Header   
          title={ employee?.firstName + ' ' + employee?.lastName }
          subtitle={ employee?.divisions?.join(", ") }
      />
      <CasesForm />
    </Box>
  );
};

export default EmployeeCase;
