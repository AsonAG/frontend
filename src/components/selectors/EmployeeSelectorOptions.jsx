import * as React from "react";
import EmployeeSelector from "./EmployeeSelector";
import { useNavigate } from "react-router-dom";

export default function EmployeeSelectorOptions(params) {
  const navigate = useNavigate();

  const options = [
    "New case",
    "Details",
    "Events",
    // "Assign tasks",
    // "Deactivate employee",
  ];

  const handleClick = (selectedIndex) => {
    console.info(
      `You clicked ${options[selectedIndex]}, for employee id: ${params.employee.employeeId}`
    );
    switch (selectedIndex) {
      case 0:
        params.setEmployeeChoice(params.employee);
        navigate("/employee");
        break;

      case 1:
        params.setEmployeeChoice(params.employee);
        navigate("/employeeData");
        break;

      case 2:
        params.setEmployeeChoice(params.employee);
        navigate("/employeeEvents");
        break;

      default:
        console.log("Selector Option chosen: default");
        break;
    }
  };

  return (
    <EmployeeSelector options={options} handleClick={handleClick}></EmployeeSelector>
  );
}
