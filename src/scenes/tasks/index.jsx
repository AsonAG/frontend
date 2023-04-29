import { Box } from "@mui/material";
import { React } from "react";
import CasesTable from "../global/CasesTable";
import Header from "../../components/Header";
import { EmployeeContext, UserContext } from "../../App";
import { useContext } from "react";

const Tasks = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Box m="25px">
      <Header title="TASKS" subtitle="Finish your tasks" />
      <CasesTable
        employee={user.employee}
        caseType={"Employee"}
        clusterName={"ECT"}
        navigateTo={"/personalCase"}
      />
    </Box>
  );
};

export default Tasks;
