import { Box } from "@mui/material";
import { React } from "react";
import CasesTable from "../../components/tables/CasesTable";
import Header from "../../components/Header";
import { UserEmployeeContext } from "../../App";
import { useContext } from "react";

const Tasks = () => {
  const userEmployee = useContext(UserEmployeeContext);

  return (
    <Box m="25px">
      <Header title="Tasks" subtitle="Finish your case tasks" />
      <CasesTable
        employeeId={userEmployee.employeeId}
        caseType={"Employee"}
        clusterName={"ECT"}
        navigateTo={"/personalCase"}
      />
    </Box>
  );
};

export default Tasks;
