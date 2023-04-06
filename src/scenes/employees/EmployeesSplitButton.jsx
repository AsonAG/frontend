import * as React from "react";
import SplitButton from "../../components/SplitButton";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { useNavigate } from "react-router-dom";

export default function EmployeesSplitButton( params ) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const navigate = useNavigate();

  const options = [
    "Employee cases",
    "Employee data",
    "Assign tasks",
    "Deactivate employee",
  ];

  const handleClick = () => {
    console.info(
      `You clicked ${options[selectedIndex]}, for payroll id: ${params.employeeId}`
    );
    switch (selectedIndex) {
        case 0:
                console.log("Option 0" + params.updateCaseName);
                navigate('/employee');
                break;
    
        case 1:
                console.log("Option 1");
                
                break;

        default:
                console.log("Option default");

                break;
    }
  };

  return (
    <SplitButton
      options={options}
      handleClick={handleClick}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    ></SplitButton>
  );
}
