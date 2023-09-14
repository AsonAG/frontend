import {
  Box,
  TextField,
  Divider,
  Toolbar,
  Drawer as MuiDrawer,
  Typography} from "@mui/material";
import { forwardRef, useEffect } from "react";
import { NavLink as RouterLink, useLoaderData, useLocation, useRouteLoaderData } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PayrollSelector from "../../components/selectors/PayrollSelector";
import { Stack } from "@mui/system";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CasesOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";

import Logo from "../../components/Logo";
import styled from "@emotion/styled";
import UserAccountComponent from "./UserAccountComponent";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    display: "block",
    textDecoration: "none",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    color: theme.palette.text.primary,
    "&:hover": {
      "color": theme.palette.blueAccent.main,
      "backgroundColor": theme.palette.blueAccent.hover
    },
    "&.active": {
      "color": theme.palette.blueAccent.main,
      "backgroundColor": theme.palette.blueAccent.active
    },
    "&.active:hover": {
      "color": theme.palette.blueAccent.main,
    }
  }
});

function NavigationItem(props) {
  const { icon, label, to, end } = props;

  return (
    <Link to={to} end={end}>
      <Stack direction="row" spacing={1}>
        {icon}
        <Typography sx={{flexGrow: 1}}>{label}</Typography>
      </Stack>
    </Link>
  );
}

function NavigationMenu({children}) {
  return (
    <Box component="nav" sx={{flexGrow: 1, p: 1, overflowY: 'auto'}}>
      {children}
    </Box>
  );
}

function NavigationGroup({ name, children, hidden = false}) {
  if (hidden) {
    return null;
  }
  return (
    <Box sx={{py: 0.5}}>
      {name && <Typography p={1} variant="body1" color="text.secondary">{name}</Typography>}
      {children}
    </Box>
  );
}
const drawerWidth = 265;
function Drawer({ temporary, open, onClose }) {
  const { tenant, user, employee } = useLoaderData();
  const location = useLocation();

	useEffect(onClose, [location])

  const drawerVariant = temporary ? "temporary" : "permanent";

  return (
    <MuiDrawer 
      variant={drawerVariant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth, 
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none'
        }
      }}>
      <Toolbar disableGutters sx={{px: 2}}>
        <Logo />
        <Divider orientation="vertical" variant="middle" flexItem sx={{mx: 2}} />
        <Stack spacing={0.5} sx={{flex: 1}} alignItems="flex-start" pt={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" px={1} >Business Unit</Typography>
          <PayrollSelector/>
        </Stack>
      </Toolbar>
      <Divider />
      <Stack sx={{flexGrow: 1, border: 0, borderRight: 1, borderStyle: 'solid', borderColor: 'divider', overflowY: 'auto'}}>
        <NavigationMenu>
          <NavigationGroup>
            <NavigationItem label="Dashboard" to="" icon={<HomeIcon />} end />
          </NavigationGroup>
          <NavigationGroup name="HR">
            <NavigationItem label="Employees" to="hr/employees" icon={<PeopleOutlinedIcon />} />
          </NavigationGroup>
          <NavigationGroup name="Company">
            <NavigationItem label="New event" to="company/new" icon={<AddOutlinedIcon />} end />
            <NavigationItem label="Data" to="company" icon={<CasesOutlinedIcon />} end />
            <NavigationItem label="Events" to="company/events" icon={<WorkHistoryOutlinedIcon />} end />
            <NavigationItem label="Documents" to="company/documents" icon={<DescriptionOutlinedIcon />} end />
          </NavigationGroup>
          <NavigationGroup name="Employee" hidden={employee === null}>
            <NavigationItem label="New event" to={`employees/${employee.id}/new`} icon={<AddOutlinedIcon />} end />
            <NavigationItem label="My Profile" to={`employees/${employee.id}`} icon={<PersonOutlineOutlinedIcon />} end />
            <NavigationItem label="Tasks" to={`employees/${employee.id}/tasks`} icon={<FormatListBulletedIcon />} end />
            <NavigationItem label="Documents" to={`employees/${employee.id}/documents`} icon={<DescriptionOutlinedIcon />} end />
          </NavigationGroup>
        </NavigationMenu>
        <Divider />
        <Box sx={{p: 2}}>
          <UserAccountComponent user={user} />
          {/* <TextField
            id="user-tenant"
            label="Company"
            variant="standard"
            disabled
            InputLabelProps={{ shrink: true }}
            defaultValue={tenant.identifier}
          /> */}
        </Box>
      </Stack>
    </MuiDrawer>
  )
};

export default Drawer;
