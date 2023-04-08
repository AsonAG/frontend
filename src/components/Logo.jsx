import { Box } from "@mui/system";
import { Link } from "react-router-dom";

export default function Logo(props) {
  return (
    <Box {...props} display="flex" justifyContent="center" flexDirection="column"  
    >
              <Link to="/">
      <img
        alt="profile-user"
        height="40px"
        src={`../../assets/logo/logo.png`}
        style={{ cursor: "pointer" }}
      />
              </Link>

    </Box>
  );
}
