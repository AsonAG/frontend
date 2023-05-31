import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

function CaseNameHeader({ caseDetails }) {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      sx={{
        // backgroundColor: colors.primary[300],
        padding: "14px 14px",
      }}
      key={"casesummary_" + caseDetails.id}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        key={"casename_" + caseDetails.id}
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
        key={"casename_desc_" + caseDetails.id}
      >
        {caseDetails.description}
      </Typography>
    </Box>
  );
}

export default CaseNameHeader;
