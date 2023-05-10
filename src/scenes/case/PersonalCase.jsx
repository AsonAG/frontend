import { Box } from "@mui/material";
import { React } from "react";
import { UserContext, UserEmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";

const PersonalCase = () => {
  // const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <Box m="25px" display="flex" flexDirection="column" >
        {/* <Header
          title={caseDetails?.displayName}
          subtitle={caseDetails?.description}
        /> */}
      <CasesForm 
        employee={userEmployee}
        navigateTo={"/tasks"}/>
    </Box>
  );
};

export default PersonalCase;
