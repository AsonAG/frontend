import { Alert, AlertTitle, Box, Typography } from "@mui/material";

const ErrorBar = (props) => {
  const { error, resetErrorBoundary } = props;
  let title;
  let subtitle;

  try {
    let text = JSON.parse(error.response.text);
    if (text.title) {
      title = text?.title;
      subtitle = JSON.stringify(text?.errors);
    } else {
      subtitle = JSON.stringify(text);
    }
  } catch (parsingErr) {
    let text = error.message;
    title = "Unexpected issue occurred"
    subtitle = text;
  }

  return (
    <Box margin="25px 40px 20px 0px">
      <Alert onClose={resetErrorBoundary} severity="error">
        <AlertTitle>
          <Typography fontWeight="bold">{title}</Typography>
        </AlertTitle>
        <Typography>{subtitle}</Typography>
      </Alert>
    </Box>
  );
};

export default ErrorBar;
