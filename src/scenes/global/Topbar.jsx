import {
  Box,
  IconButton,
  useTheme,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

function Topbar({ children }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar elevation={0} sx={{ backgroundColor: "background.default", position: "static" }}>
      <Toolbar disableGutters sx={{px: 2}}>
        {children}
        <Box sx={{flexGrow: 1}} />

        <IconButton onClick={colorMode.toggleColorMode} size="large">
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
