import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { tokens } from "../../theme";

function CaseNameHeader({ caseDetails }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box
      display="flex"
      alignItems="baseline"
      sx={{
        backgroundColor: colors.primary[400],
        padding: "14px 14px",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          marginLeft: "6px",
          marginRight: "20px",
          flexShrink: 0,
        }}
      >
        {caseDetails.displayName}
      </Typography>

      <Typography
        variant="h5"
        sx={{ color: "text.secondary" }}
      >
        {caseDetails.description}
      </Typography>
    </Box>
  );
}

export default CaseNameHeader;
