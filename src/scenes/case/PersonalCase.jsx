import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";

const PersonalCase = () => {
  return (
    <Box m="25px" display="flex" flexDirection="column" >
        {/* <Header
          title={caseDetails?.displayName}
          subtitle={caseDetails?.description}
        /> */}
      <CasesForm />
    </Box>
  );
};

export default PersonalCase;
