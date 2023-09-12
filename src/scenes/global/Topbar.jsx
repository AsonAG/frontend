import {
  Box,
  IconButton,
  useTheme,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AccountCircle } from "@mui/icons-material";
import Logo from "../../components/Logo";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

const Topbar = ({ toggleSidebar, renderSidebarButton }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const settingsLink = import.meta.env.VITE_AUTHORITY_SETTINGS_URL;

  const handleLogout = () => {
    // TODO AJO handle logout
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar elevation={0} sx={{ backgroundColor: "background.default", position: "static" }}>
      <Toolbar>
        {renderSidebarButton && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Logo />
        <Box sx={{flexGrow: 1}} />

        <IconButton onClick={colorMode.toggleColorMode} size="large">
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to={settingsLink}>
            User settings
          </MenuItem>
          <MenuItem component={Link} to="/tenants" onClick={handleClose}>Switch company</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
