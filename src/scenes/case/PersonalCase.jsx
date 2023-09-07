import { React } from "react";
import CasesForm from "../global/CasesForm";

const PersonalCase = () => {
  // TODO AJO fix 
  const [ userEmployee, setEmployee ] = useState(null);

  return (
      <CasesForm 
        employee={userEmployee}
        navigateTo={"/"}/>
  );
};

export default PersonalCase;
