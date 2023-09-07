import { React } from "react";
import CasesForm from "../global/CasesForm";

const EmployeeCase = () => {
  // TODO AJO fix 
  const [ employee, setEmployee ] = useState(null);

  return (
    <CasesForm
      title={employee.firstName + " " + employee.lastName}
      employee={employee}
      navigateTo={"/employee"}
    />
  );
};

export default EmployeeCase;
