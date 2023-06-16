import * as React from "react";
import EmployeeSelector from "./EmployeeSelector";
import { useNavigate } from "react-router-dom";

export default function EmployeeSelectorOptions(params) {
  const navigate = useNavigate();

  const options = [
    "Employee cases",
    "Employee data",
    "Employee events",
    "Assign tasks",
    "Deactivate employee",
  ];

  const handleClick = (selectedIndex) => {
    console.info(
      `You clicked ${options[selectedIndex]}, for employee id: ${params.employee.employeeId}`
    );
    switch (selectedIndex) {
      case 0:
        console.log("Option 0: " + options[0]);
        params.setEmployeeChoice(params.employee);
        navigate("/employee");
        break;

      case 1:
        console.log("Option 1: " + options[1]);
        params.setEmployeeChoice(params.employee);
        navigate("/employeeData");
        break;

      case 2:
        console.log("Option 2: " + options[2]);
        params.setEmployeeChoice(params.employee);
        navigate("/employeeEvents");
        break;

      default:
        console.log("Option default");
        break;
    }
  };

  return (
    <EmployeeSelector options={options} handleClick={handleClick}></EmployeeSelector>
  );
}
