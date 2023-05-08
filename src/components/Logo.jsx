import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../theme";
import { useTheme } from "@emotion/react";
import { useContext } from "react";

export default function Logo(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      {...props}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Link to="/">
        {theme.palette.mode === "dark" ? (
          <img
            alt="logo"
            height="40px"
            src={`../../assets/logo/logo.png`}
            style={{ cursor: "pointer" }}
          />
        ) : (
          <img
            alt="logo"
            height="40px"
            src={`../../assets/logo/logo_dark.png`}
            style={{ cursor: "pointer" }}
          />
        )}
      </Link>
    </Box>
  );
}
