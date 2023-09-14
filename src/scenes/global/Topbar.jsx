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
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { AccountCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";

function Topbar({ children }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <MenuItem component={Link} to="/tenants" onClick={handleClose}>Switch company</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
