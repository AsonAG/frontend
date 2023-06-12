import { Alert, AlertTitle, Box, Icon, Stack, Typography } from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Logo from "../Logo";

const UnknownErrorPage = (props) => {
  const { error, resetErrorBoundary } = props;

  return (
    <Box m="25px">
      <Logo />
      <Stack margin="25px 40px 20px 5px" spacing={2}>
        <SentimentVeryDissatisfiedIcon fontSize="large" />
        <Typography variant="h3" fontWeight="bold">
          Sorry, something went wrong. Please open the page again.
        </Typography>

        <Alert severity="error">
          <Typography>{JSON.stringify(error.message, null, 2)}</Typography>
        </Alert>
      </Stack>
    </Box>
  );
};

export default UnknownErrorPage;
