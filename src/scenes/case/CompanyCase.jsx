import { Box } from "@mui/material";
import { React } from "react";
import { UserContext, UserEmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";
import Header from "../../components/Header";
import CasesFormWrapper from "../global/CasesFormWrapper";

const CompanyCase = () => {
  const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <CasesForm
      title={user.currentPayrollName}
      employee={userEmployee}
      navigateTo={"/company"}
    />
  );
};

export default CompanyCase;
