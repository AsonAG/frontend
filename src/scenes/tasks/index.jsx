import { Box } from "@mui/material";
import { React } from "react";
import CasesTable from "../global/CasesTable";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const Tasks = ({ updateCaseName }) => {
  return (
    <Box m="25px">
      <Header title="TASKS" subtitle="Finish your tasks" />
      <CasesTable
        updateCaseName={updateCaseName}
        caseType={"Employee"}
        clusterName={"ECT"}
      />
    </Box>
  );
};

export default Tasks;
