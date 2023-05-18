import { Box, Drawer, List, ListItem, Paper, Typography } from "@mui/material";
import { React, useContext } from "react";
import CasesForm from "../global/CasesForm";
import EmployeeHeader from "../../components/EmployeeHeader";
import { EmployeeSelectionContext } from "../../App";
import Header from "../../components/Header";

const EmployeeCase = () => {
  const { employee, setEmployee } = useContext(EmployeeSelectionContext);

  return (
    <Box m="25px" display="flex" flexDirection="row" width="100%">
      {/* <EmployeeHeader employee={employee} /> */}
      <Box display="flex" flexDirection="column">
        {/* <Header title={employee.firstName + " " + employee.lastName} /> */}

<List>
  <ListItem>
        <Typography variant="h3" fontWeight="bold">
          {employee.firstName + " " + employee.lastName}
        </Typography>
        </ListItem>
        
        <ListItem><Typography >
          Case 1
        </Typography>
        </ListItem>

        <ListItem><Typography >
          Case 2
        </Typography>
        </ListItem>
        <ListItem><Typography >
          Case 3
        </Typography>
        </ListItem>
        <ListItem><Typography >
          Case 4
        </Typography>
        </ListItem>

        </List>
      </Box>

      <Paper
        style={{
          maxHeight: "80vh",
          // maxHeight: "80%",
          overflow: "auto",
          margin: "0 25px",
        }}
      >
        <CasesForm employee={employee} navigateTo={"/employee"} />
      </Paper>
    </Box>
  );
};

export default EmployeeCase;
