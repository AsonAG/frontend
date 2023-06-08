import { Alert, AlertTitle, Box, Typography } from "@mui/material";

const ErrorBar = (props) => {
  const { error, resetErrorBoundary } = props;

  return (
    <Box margin="25px 40px 20px 0px">
      <Alert onClose={resetErrorBoundary} severity="error">
        <Typography fontWeight="bold">{error.message}</Typography>
      </Alert>
    </Box>
  );
};

export default ErrorBar;
