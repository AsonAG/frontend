import { Box } from "@mui/material";
import { React } from "react";
import { useContext } from "react";
import { EmployeeSelectionContext } from "../../App";
import CasesTable from "../global/CasesTable";
import EmployeeHeader from "../../components/EmployeeHeader";

const EmployeeData = () => {
  const {employee, setEmployee} = useContext(EmployeeSelectionContext);

  return (
    <Box m="25px">
      <EmployeeHeader employee={employee} />
      <CasesTable
        employeeId={employee.employeeId}
        caseType={"Employee"}
        clusterName={"EmployeeData"}
        navigateTo={"/employeeDataCase"}
      />
    </Box>
  );
};

export default EmployeeData;
