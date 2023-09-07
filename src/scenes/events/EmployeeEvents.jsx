import { React } from "react";
import EventsTable from "../../components/tables/EventsTable";
import { useRouteLoaderData } from "react-router-dom";

const EmployeeEvents = () => {
  const employee = useRouteLoaderData("employee");

  return (
    <EventsTable 
        employeeId={employee.id}
        caseType={"Employee"}
    />
  );
};

export default EmployeeEvents;
