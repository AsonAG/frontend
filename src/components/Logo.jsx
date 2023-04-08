import { Box } from "@mui/system";

export default function Logo(props) {
  return (
    <Box {...props} display="flex" justifyContent="center" flexDirection="column"  
    >
      <img
        alt="profile-user"
        height="40px"
        src={`../../assets/logo/logo.png`}
        style={{ cursor: "pointer" }}
      />
    </Box>
  );
}
