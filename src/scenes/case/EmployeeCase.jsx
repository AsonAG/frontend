import { Box, Drawer, List, ListItem, Paper, Typography } from "@mui/material";
import { React, useContext } from "react";
import CasesForm from "../global/CasesForm";
import EmployeeHeader from "../../components/EmployeeHeader";
import { EmployeeSelectionContext } from "../../App";
import Header from "../../components/Header";
import CasesFormWrapper from "../global/CasesFormWrapper";

const EmployeeCase = () => {
  const { employee, setEmployee } = useContext(EmployeeSelectionContext);

  return (
    <CasesFormWrapper
      title={employee.firstName + " " + employee.lastName}
      employee={employee}
      navigateTo={"/employee"}
    />
  );
};

export default EmployeeCase;
