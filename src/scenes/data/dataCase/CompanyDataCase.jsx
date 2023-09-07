import { React } from "react";
import CasesForm from "../../global/CasesForm";

const CompanyDataCase = () => {
  // TODO AJO fix 
  const [ user, setUser ] = useState(null);
  const [ userEmployee, setEmployee ] = useState(null);

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
