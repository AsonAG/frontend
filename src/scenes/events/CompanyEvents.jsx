import { Box } from "@mui/material";
import { React } from "react";
import Header from "../../components/Header";
import EventsTable from "../../components/tables/EventsTable";

const CompanyEvents = () => {

  return (
    <Box m="25px">
      <Header title="Company Events" />
      <EventsTable 
        // employeeId={employee.employeeId}
        caseType={"Company"}
        // clusterName={"CompanyEvents"}
        />
    </Box>
  );
};

export default CompanyEvents;
