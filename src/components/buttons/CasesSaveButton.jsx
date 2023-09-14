import SendIcon from "@mui/icons-material/Send";
import { Button, Typography } from "@mui/material";

export default function CasesSaveButton({ onSubmit }) {
  return (
    <Button
      disableRipple
      type="button"
      variant="contained"
      color="primary"
      size="large"
      onClick={onSubmit}
      endIcon={<SendIcon htmlColor="#ffffff" />}
    >
      <Typography fontWeight="bold" color="#ffffff">
        Save
      </Typography>
    </Button>
  );
}
