import { useRouteLoaderData } from "react-router-dom";
import CasesTable from "../../components/tables/CasesTable";

const EmployeeCases = () => {
  const employee = useRouteLoaderData("employee");

  return (
    <CasesTable 
        caseType={'Employee'}
        clusterName={"NotAvailable"}
        employeeId={employee.id}
        navigateTo={'/employeeCase'}
    />
  );
};

export default EmployeeCases;
