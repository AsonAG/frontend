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
          color="secondary"
          size="large"
          onClick={onSubmit}
          endIcon={<SendIcon />}
        >
          <Typography fontWeight="bold">Send</Typography>
        </Button>
      )}
    </Box>
  );
}
