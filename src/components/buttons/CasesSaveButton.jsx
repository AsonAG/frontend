import SendIcon from "@mui/icons-material/Send";
import { Button, Typography } from "@mui/material";

export default function CasesSaveButton({ onSubmit }) {
  return (
    <Button
      disableRipple
      type="submit"
      variant="contained"
      color="blueAccent"
      size="large"
      onClick={onSubmit}
      endIcon={<SendIcon htmlColor="#ffffff" />}
    >
      <Typography fontWeight="bold" color="#ffffff">
        Send
      </Typography>
    </Button>
  );
}
