import React, { useState } from "react";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from "react-router-dom";

// TODO AJO fix this
function PayrollSelector({currentCompany}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return <>
    <Button
      color="blueAccent"
      onClick={handleClick}
      endIcon={<ArrowDropDownIcon />}
      sx={{
        py: 0,
        borderRadius: (theme) => theme.spacing(1),
        "& .MuiButton-endIcon": {
          ml: 0.25,
          mt: -0.5
        }
      }}
    >
      <Typography component="span" variant="button" textOverflow="ellipsis" overflow="hidden">
        {currentCompany.identifier}
      </Typography>
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem component={Link} to="/tenants">Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
  </>
}

export default PayrollSelector;