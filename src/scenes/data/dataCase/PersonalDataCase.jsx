import { useContext } from "react";
import { UserEmployeeContext } from "../../../App";
import CasesForm from "../../global/CasesForm";

const PersonalDataCase = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <CasesForm
      title={userEmployee.firstName + " " + userEmployee.lastName}
      employee={userEmployee}
      navigateTo={"/personalData"}
      readOnly={true}
    />
  );
};

export default PersonalDataCase;
