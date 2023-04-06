import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const Dashboard = () => {
    const { employeeChoice: employee, setEmployeeChoice } = useContext(EmployeeContext);
    setEmployeeChoice(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
      <Box m="25px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </Box>
      </Box>
  )};  



  export default Dashboard;