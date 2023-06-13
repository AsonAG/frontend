import { Alert, AlertTitle, Box, Typography } from "@mui/material";

const ErrorBar = (props) => {
  const { error, resetErrorBoundary } = props;

  // TODO: Stringify JSON message
  return (
    <Box margin="25px 40px 20px 0px">
      <Alert onClose={resetErrorBoundary} severity="error">
        <Typography fontWeight="bold">{JSON.stringify(error.message, null, 2)}</Typography> 
      </Alert>
    </Box>
  );
};

export default ErrorBar;
