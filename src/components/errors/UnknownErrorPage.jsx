import { Alert, AlertTitle, Box, Icon, Stack, Typography } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Topbar from "../../scenes/global/Topbar";

const UnknownErrorPage = (props) => {
  const { error, resetErrorBoundary } = props;

  return (
    <Box marginTop="60px" marginLeft="25px">
      
      <Topbar
        noSidebar={true}
      />

      <Stack margin="25px 40px 20px 5px" spacing={2}>
        <SentimentVeryDissatisfiedIcon fontSize="large" />
        <Typography variant="h3" fontWeight="bold">
          Sorry, this feature doesn't work yet. We are working hard to fix it
          for you...
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          Please open the main page again.
        </Typography>

        <Alert severity="error">
          <Typography>{JSON.stringify(error.message, null, 2)}</Typography>
        </Alert>
      </Stack>
    </Box>
  );
};

export default UnknownErrorPage;
