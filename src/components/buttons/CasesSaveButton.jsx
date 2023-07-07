import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Typography } from "@mui/material";

export default function CasesSaveButton({onSubmit, caseIsReadOnly}) {
  return (
    <Box display="flex" justifyContent="center">
      {!caseIsReadOnly && (
        <Button
          // disable={}
          //   fullWidth
          disableRipple
          type="submit"
          variant="contained"
          color="blueAccent"
          size="large"
          onClick={onSubmit}
          endIcon={<SendIcon htmlColor="#ffffff" />}
        >
          <Typography fontWeight="bold" color="#ffffff">Send</Typography>
        </Button>
      )}
    </Box>
  );
}
