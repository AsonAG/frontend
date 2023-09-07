import { React } from "react";
import CasesForm from "../global/CasesForm";

const CompanyCase = () => {
  // TODO AJO fix 
  const [ user, setUser ] = useState(null);
  const [ userEmployee, setEmployee ] = useState(null);

  return (
    <CasesForm
      title={user.currentPayrollName}
      employee={userEmployee}
      navigateTo={"/company"}
    />
  );
};

export default CompanyCase;
