import SendIcon from "@mui/icons-material/Send";
import { CircularProgress } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useNavigation } from "react-router-dom";

const iconProps = {
  size: "1em",
  sx: {
    color: "common.white"
  }
};

export default function CasesSaveButton({ onSubmit }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && navigation.json?.intent === "addCase";
  const isRedirecting = navigation.state === "loading" && navigation.json && navigation.formAction !== navigation.location.pathname;
  const isProcessing = isSubmitting || isRedirecting;
  const icon = isProcessing ? <CircularProgress {...iconProps} /> : <SendIcon {...iconProps} />;

  return (
    <Button
      disabled={isProcessing}
      disableRipple
      type="button"
      variant="contained"
      color="primary"
      size="large"
      onClick={onSubmit}
      endIcon={icon}
    >
      <Typography fontWeight="bold" color="#ffffff">
        Save
      </Typography>
    </Button>
  );
}
