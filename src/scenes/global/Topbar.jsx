import {
  Box,
  IconButton,
  useTheme,
  Autocomplete,
  TextField,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { AccountCircle } from "@mui/icons-material";
import Logo from "../../components/Logo";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import PayrollSelector from "../../components/PayrollSelector";
import { useAuth } from "oidc-react";
import { UserContext } from "../../App";

const Topbar = ({ isCollapsed, setIsCollapsed, handleLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useAuth();
  const { user, setUser } = useContext(UserContext);
  const handleChange = (event) => {
    // setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchTenant = () => {
    setUser(current => ({
      ...current,
      tenantId: null
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
          padding: "0 22px 0 0px !important",
        },
        "& .MuiButtonBase-root:hover": {
          color: "#868dfb !important",
        },
      }}
    >
      <AppBar>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" flexDirection="row" >
            {/* LOGO AND MENU ICON */}
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
                  margin: "0"
                }}
              >
                <MenuOutlinedIcon />
              </IconButton>
            </MenuItem>

            <MenuItem
            sx={{
              margin: "0 0"
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
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleSwitchTenant}>Switch tenant</MenuItem>
              <MenuItem onClick={() => { auth.signOut();handleLogout();}}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;
