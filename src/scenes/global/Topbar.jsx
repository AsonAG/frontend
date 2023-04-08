import {
  Box,
  IconButton,
  useTheme,
  Autocomplete,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
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

const Topbar = ({ isCollapsed, setIsCollapsed, handleLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    padding: '0 22px 0 0px !important'
  },
  "& .MuiButtonBase-root:hover": {
    color: "#868dfb !important",
  },
}}>
    <AppBar>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box 
          display="flex" 
          flexDirection="row" 
          paddingLeft="15px"
          >
        {/* LOGO AND MENU ICON */}
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          // icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          style={{
            // margin: "10px 0 20px 0px",
            // marginBottom: "15px",
            color: colors.grey[100],
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <MenuOutlinedIcon />
          </IconButton>
        </MenuItem>

        <Logo />
        </Box>

        <div>
          <IconButton
            onClick={colorMode.toggleColorMode}
            size="large"
            >
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
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
</Box>
  );
};

export default Topbar;
