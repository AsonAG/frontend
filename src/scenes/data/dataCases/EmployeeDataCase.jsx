import { React, useContext } from "react";
import { EmployeeSelectionContext } from "../../../App";
import CasesForm from "../../global/CasesForm";

const EmployeeDataCase = () => {
  const { employee, setEmployee } = useContext(EmployeeSelectionContext);

  return (
    <CasesForm
      title={employee.firstName + " " + employee.lastName}
      employee={employee}
      navigateTo={"/employeeDataCase"}
      readOnly={true}
    />
  );
};

export default EmployeeDataCase;
