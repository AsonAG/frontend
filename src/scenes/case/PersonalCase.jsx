import { Box } from "@mui/material";
import { React } from "react";
import { UserContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";

const PersonalCase = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Box m="25px" display="flex" flexDirection="column" >
        {/* <Header
          title={caseDetails?.displayName}
          subtitle={caseDetails?.description}
        /> */}
      <CasesForm 
        employee={user.employee}
        navigateTo={"/tasks"}/>
    </Box>
  );
};

export default PersonalCase;
