import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { useMatches } from "react-router-dom";


export default function Logo(props) {
  const theme = useTheme();
  const matches = useMatches();

  const location = matches ? matches[0].pathname : "/";
  const fileName = theme.palette.mode === "dark" ? "logo.png" : "logo_dark.png";
  const src = "/assets/logo/" + fileName;

  return (
    <Box
      {...props}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Link to={location}>
        <img
            alt="logo"
            height="40px"
            src={src}
            style={{ cursor: "pointer" }}
          />
      </Link>
    </Box>
  );
}
