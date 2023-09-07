import { React } from "react";
import CasesTable from "../../components/tables/CasesTable";
import { useRouteLoaderData } from "react-router-dom";

const EmployeeData = () => {
  const employee = useRouteLoaderData("employee");
  return (
    <CasesTable
        employeeId={employee.id}
        caseType={"Employee"}
        clusterName={"EmployeeData"}
        navigateTo={"/employeeDataCase"}
      />
  );
};

export default EmployeeData;
