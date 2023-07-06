import {
  Box,
  IconButton,
  useTheme,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AccountCircle, TypeSpecimenOutlined } from "@mui/icons-material";
import Logo from "../../components/Logo";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAuth } from "oidc-react";
import { UserContext } from "../../App";
import UsersApi from "../../api/UsersApi";
import ApiClient from "../../api/ApiClient";
import { Link, useNavigate } from "react-router-dom";

const Topbar = ({ isCollapsed, setIsCollapsed, noSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useAuth();
  const { user, setUser } = useContext(UserContext);
  const settingsLink = process.env.REACT_APP_AUTHORITY_SETTINGS_URL;

  const handleLogout = () => {
    setUser({});
    auth.signOut();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchTenant = () => {
    setUser((current) => ({
      ...current,
      tenantId: null,
    }));
    handleClose();
  };

  return (
    // <Box
    //   display="flex"
    //   flexDirection="row-reverse"
    //   justifyContent="space-between"
    //   padding="10px 6px 0px">
    //   {/* ICONS */}
    //   <Box display="flex">
    //     <IconButton
    //       onClick={colorMode.toggleColorMode}
    //       // size="large"
    //       >
    //       {theme.palette.mode === "dark" ? (
    //         <DarkModeOutlinedIcon />
    //       ) : (
    //         <LightModeOutlinedIcon />
    //       )}
    //     </IconButton>

    //     {/* <IconButton>
    //       <NotificationsOutlinedIcon />
    //     </IconButton>
    //     <IconButton>
    //       <SettingsOutlinedIcon />
    //     </IconButton> */}

    //     <IconButton>
    //       <PersonOutlinedIcon />
    //     </IconButton>
    //   </Box>
    // </Box>
    <Box
      sx={{
        "& .MuiToolbar-root": {
          background: `${colors.primary[400]} !important`,
          padding: "0 22px 0 0 !important",
        },
        "& .MuiButtonBase-root:hover": {
          color: "#868dfb !important",
        },
      }}
    >
      <AppBar
      // position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" flexDirection="row">
            {/* LOGO AND MENU ICON */}
            {!noSidebar && (
              <MenuItem
                style={{
                  color: colors.grey[100],
                }}
              >
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{
                    margin: "0",
                  }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </MenuItem>
            )}

            <MenuItem
              sx={{
                margin: "0 0",
              }}
            >
              <Logo />
            </MenuItem>
          </Box>

          <Box display="flex">
            {/* <PayrollSelector /> */}

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
              <MenuItem onClick={handleSwitchTenant}>Switch company</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;
