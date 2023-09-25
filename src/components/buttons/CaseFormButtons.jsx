import SendIcon from "@mui/icons-material/Send";
import { CircularProgress, Stack } from "@mui/material";
import { Button, Typography } from "@mui/material";
import { useNavigation } from "react-router-dom";
import { Link } from "react-router-dom";

const iconProps = {
  size: "1em",
  sx: {
    color: "common.white"
  }
};

function CaseFormButtons({ onSubmit }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && navigation.json?.intent === "addCase";
  const isRedirecting = navigation.state === "loading" && navigation.json && navigation.formAction !== navigation.location.pathname;
  const isProcessing = isSubmitting || isRedirecting;
  const icon = isProcessing ? <CircularProgress {...iconProps} /> : <SendIcon {...iconProps} />;

  return (
    <Stack direction="row" spacing={2}>
      <Button
        disableRipple
        LinkComponent={Link}
        to=".."
        relative="path"
      >
        <Typography>
          Cancel
        </Typography>
      </Button>
      <Button
        disabled={isProcessing}
        disableRipple
        variant="contained"
        color="primary"
        size="large"
        onClick={onSubmit}
        endIcon={icon}
      >
        <Typography fontWeight="bold" color="common.white">
          Save
        </Typography>
      </Button>
    </Stack>
  );
}

export { CaseFormButtons }