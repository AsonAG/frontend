import React, { useState } from "react";
import { Button, Typography, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, generatePath, matchRoutes, useLoaderData, useParams } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { routeData } from "../../routes";

function PayrollSelector() {
  const { payroll, payrolls } = useLoaderData();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const queryParams = useParams();
  useDocumentTitle(`Ason - ${payroll.name}`);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    const route = matchRoutes(routeData, window.location).map(r => r.route.path).join("/");
    if (route) {
      setAnchorEl(event.currentTarget);
      
      const menuItems = payrolls.map(p => {
        const to = "/" + generatePath(route, {...queryParams, payrollId: p.id});
        return <MenuItem key={p.id} component={Link} to={to} onClick={handleClose}>{p.name}</MenuItem>;
      })
      setMenuItems(menuItems);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuItems([]);
  };

  return <>
    <Button
      color="primary"
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
      {menuItems}
    </Menu>
  </>
}

export default PayrollSelector;