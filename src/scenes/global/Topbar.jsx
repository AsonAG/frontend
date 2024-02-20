import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDarkMode } from "../../theme";

function Topbar({ children }) {
  const { isDarkMode, setDarkMode } = useDarkMode();

  return (
    <AppBar elevation={0} sx={{ backgroundColor: "background.default", position: "static" }}>
      <Toolbar disableGutters sx={{mx: {sm: 2}, gap: {xs: 1, sm: 2}}} spacing={1} >
        {children}
        <Box sx={{flexGrow: 1}} />

        <IconButton onClick={() => setDarkMode(isDarkMode ? 'light' : 'dark')} size="large">
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
