import {
  Stack,
} from "@mui/material";
import Header from "../../components/Header";

function Dashboard() {
  return (
    <Stack p={4} gap={2} sx={{height: "100%"}}>
      <Header title="Dashboard" />
    </Stack>
  );
};

export default Dashboard;
