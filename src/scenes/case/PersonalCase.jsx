import { Box } from "@mui/material";
import { React } from "react";
import { UserContext, UserEmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";
import CasesFormWrapper from "../global/CasesFormWrapper";

const PersonalCase = () => {
  // const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);

  return <CasesFormWrapper employee={userEmployee} navigateTo={"/tasks"} />;
};

export default PersonalCase;
