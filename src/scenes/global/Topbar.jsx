import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useTernaryDarkMode } from "usehooks-ts";

function Topbar({ children }) {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  return (
    <AppBar elevation={0} sx={{ backgroundColor: "background.default", position: "static" }}>
      <Toolbar disableGutters sx={{px: 2}}>
        {children}
        <Box sx={{flexGrow: 1}} />

        <IconButton onClick={() => setTernaryDarkMode(isDarkMode ? 'light' : 'dark')} size="large">
          {isDarkMode ? (
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
