import React, { useState } from "react";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, useLoaderData } from "react-router-dom";

function PayrollSelector() {
  const { payroll, payrolls } = useLoaderData();
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
        minWidth: 0,
        py: 0,
        borderRadius: (theme) => theme.spacing(1),
        "& .MuiButton-endIcon": {
          ml: 0.25,
          mt: -0.5
        }
      }}
    >
      <Typography component="span" variant="button" textOverflow="ellipsis" overflow="hidden">
        {payroll.name}
      </Typography>
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {
        payrolls.map(p => <MenuItem key={p.id} component={Link} to={"./../" + p.id} onClick={handleClose}>{p.name}</MenuItem>)
      }
    </Menu>
  </>
}

export default PayrollSelector;