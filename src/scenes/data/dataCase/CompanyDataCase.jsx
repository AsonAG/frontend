import { Box } from "@mui/material";
import { React } from "react";
import { useContext } from "react";
import { UserContext, UserEmployeeContext } from "../../../App";
import CasesForm from "../../global/CasesForm";

const CompanyDataCase = () => {
  const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <CasesForm
      title={user.currentPayrollName}
      employee={userEmployee}
      navigateTo={"/companyData"}
      readOnly={true}
    />
  );
};

export default CompanyDataCase;
