import { Box } from "@mui/material";
import { React } from "react";
import CasesTable from "../../components/CasesTable";
import Header from "../../components/Header";

const Tasks = ({ updateCaseName }) => {
  return (
    <Box m="25px">
      <Header title="TASKS" subtitle="Finish your tasks" />
      <CasesTable updateCaseName={updateCaseName} caseType={'Employee'}/>
    </Box>
  );
};

export default Tasks;
