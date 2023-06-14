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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="25px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      </Box>
      <Box mt="25px">

      </Box>
    </Box>
  );
};

export default Dashboard;
