import Header from "./Header";

function EmployeeHeader({employee}) {
  return (
    <Header
      title={employee.firstName + " " + employee.lastName}
      subtitle={employee.divisions?.join(", ")}
    />
  );
}

export default EmployeeHeader;
