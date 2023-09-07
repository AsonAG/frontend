import CasesForm from "../../global/CasesForm";

const EmployeeDataCase = () => {
  // TODO AJO fix 
  const [ employee, setEmployee ] = useState(null);

  return (
    <CasesForm
      title={employee.firstName + " " + employee.lastName}
      employee={employee}
      navigateTo={"/employeeData"}
      readOnly={true}
    />
  );
};

export default EmployeeDataCase;
