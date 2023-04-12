import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { EmployeeContext } from "../../App";
import { useContext } from "react";

const Dashboard = () => {
  const { employeeChoice: employee, setEmployeeChoice } =
    useContext(EmployeeContext);
  setEmployeeChoice(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
      <Box mt="25px">
        <Typography variant="h5">Payroll Services</Typography>

<Card sx={{ mt: "10px", maxWidth: 345 }}>
  <CardActionArea>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Payroll 1
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>

<Card sx={{ mt: "10px", maxWidth: 345 }}>
  <CardActionArea>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        Payroll 2
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
