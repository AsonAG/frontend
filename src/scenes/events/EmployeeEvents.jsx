import { Box } from "@mui/material";
import { React } from "react";
import { useContext } from "react";
import { EmployeeSelectionContext } from "../../App";
import EmployeeHeader from "../../components/EmployeeHeader";
import EventsTable from "../../components/tables/EventsTable";

const EmployeeEvents = () => {
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);

  return (
    <Box m="25px">
      <EmployeeHeader employee={employee} />
      <EventsTable 
        employeeId={employee.employeeId}
        caseType={"Employee"}
        // clusterName={"EmployeeEvents"}
        />
    </Box>
  );
};

export default EmployeeEvents;
