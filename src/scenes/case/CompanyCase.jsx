import { Box } from "@mui/material";
import { React } from "react";
import { UserContext, UserEmployeeContext } from "../../App";
import { useContext } from "react";
import CasesForm from "../global/CasesForm";
import Header from "../../components/Header";

const CompanyCase = () => {
  const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);
  

  return (
    <Box m="25px" display="flex" flexDirection="column" >
        <Header
          title={user.currentPayrollName}
          subtitle={'PAYROLL'}
        />
      <CasesForm 
        employee={userEmployee}
        navigateTo={"/company"}/>
    </Box>
  );
};

export default CompanyCase;
