import * as React from "react";
import SplitButton from "../SplitButton";
import useDidMountEffect from "../hooks/useDidMountEffect";

export default function GenericSelector() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
                
                break;
    
        case 1:
                
                break;

        default:
                break;
    }
  };

  useDidMountEffect(() => {
    handleClick();
  }, [selectedIndex]);

  return (
    <SplitButton
      options={options}
      handleClick={handleClick}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
    ></SplitButton>
  );
}
