import { useRouteLoaderData } from "react-router-dom";
import DocumentsTable from "../../components/tables/DocumentsTable";

const EmployeeDocuments = () => {
  const employee = useRouteLoaderData("employee");

  return employee && (
    <DocumentsTable 
        caseType={'Employee'}
        employeeId={employee.id}    
    />
  );
};

export default EmployeeDocuments;
