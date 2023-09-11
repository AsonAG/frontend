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
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";

const Topbar = ({ toggleSidebar, renderSidebarButton }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
    <Box
      sx={{
        "& .MuiToolbar-root": {
          background: `${colors.primary[400]} !important`,
          padding: "0 22px 0 0 !important",
        },
        "& .MuiButtonBase-root:hover": {
          color: `${colors.blueAccent} !important`,
        },
      }}
    >
      <AppBar elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" flexDirection="row">
            {renderSidebarButton && (
              <MenuItem
                style={{
                  color: colors.grey[100],
                }}
                onClick={toggleSidebar}
              >
                <MenuOutlinedIcon />
              </MenuItem>
            )}

            <MenuItem
              sx={{
                margin: "0",
              }}
            >
              <Logo />
            </MenuItem>
          </Box>

          <Box display="flex">
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;
