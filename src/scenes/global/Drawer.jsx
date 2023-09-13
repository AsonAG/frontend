import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Toolbar,
  Drawer as MuiDrawer,
  Typography,
  Button,
  Menu as MuiMenu,
  MenuItem
} from "@mui/material";
import { forwardRef, useState } from "react";
import { NavLink as RouterLink, useRouteLoaderData } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PayrollSelector from "../../components/selectors/PayrollSelector";
import { Stack } from "@mui/system";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CasesOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../../components/Logo";

const Link = forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const iconWidth = (theme) => theme.spacing(4);

function ListItemLink(props) {
  const { icon, label, to, indent } = props;

  return (
    <li>
      <ListItemButton 
        component={Link} 
        to={to} 
        sx={{pl: 2 + indent}} 
        end 
        style={({ isActive }) => {return {color: isActive ? "#461eb7" : "" }}}
        disableGutters
      >
        {icon ? <ListItemIcon sx={{ minWidth: iconWidth }} >{icon}</ListItemIcon> : null}
        <ListItemText primary={label} />
      </ListItemButton>
    </li>
  );
}

function mapItems(items, indent) {
  return items.map(nav => {
    if (nav.items) {
      return <SubMenu key={nav.text} menu={nav} indent={indent} />
    }
    return <ListItemLink key={nav.text} {...nav} indent={indent} />
  })
}

function Menu({ navigation, ...boxProps }) {
  return <Box component="nav" {...boxProps}>
      <Stack component={List} divider={<Divider />} >
      { mapItems(navigation, 0) }
    </Stack>;
  </Box>
}

function SubMenu({menu, indent}) {
  const [open, setOpen] = useState(true);

  const toggleOpen = () => setOpen(o => !o);

  return <List>
    <ListItemButton onClick={toggleOpen} sx={{pl: 2 + indent}}>
      <ListItemIcon sx={{ minWidth: iconWidth }}>
        {menu.icon}
      </ListItemIcon>
      <ListItemText primary={menu.label} />
      {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
    </ListItemButton>
    <Collapse in={open} mountOnEnter>
      { mapItems(menu.items, indent + 1.5) }
  </Collapse>
  </List>
  
}

const navigation = [
  {
    label: "Dashboard",
    to: "",
    icon: <HomeIcon />
  },
  {
    label: "HR",
    icon: <WorkIcon />,
    items: [
      {
        label: "Employees",
        to: "hr/employees",
        icon: <PeopleOutlinedIcon />
      },
      {
        label: "Company",
        icon: <ApartmentOutlinedIcon />,
        items: [
          {
            label: "New event",
            to: "/company",
            icon: <AddOutlinedIcon />
          },
          {
            label: "Data",
            to: "/companyData",
            icon: <CasesOutlinedIcon />
          },
          {
            label: "Events",
            to: "/companyEvents",
            icon: <WorkHistoryOutlinedIcon />
          },
          {
            label: "Documents",
            to: "/companyDocuments",
            icon: <DescriptionOutlinedIcon />
          }
        ]
      }
    ]
  },
  {
    label: "Employee",
    icon: <PersonIcon />,
    items: [
      {
        label: "New event",
        to: "/ESS",
        icon: <AddOutlinedIcon />
      },
      {
        label: "My Profile",
        to: "/personalData",
        icon: <PersonOutlineOutlinedIcon />
      },
      {
        label: "Tasks",
        to: "/ECT",
        icon: <FormatListBulletedIcon />
      },
      {
        label: "Documents",
        to: "/personalDocuments",
        icon: <DescriptionOutlinedIcon />
      }
    ]
  }
]

// TODO AJO Tenant + PayrollSelector
function CompanySelector({currentCompany}) {
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
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
      endIcon={<ArrowDropDownIcon />}
    >
      {currentCompany.identifier}
    </Button>
    <MuiMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem component={Link} to="/tenants">Profile</MenuItem>
      <MenuItem onClick={handleClose}>My account</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </MuiMenu>
  </>
}

const drawerWidth = 265;
function Drawer() {
  const { tenant } = useRouteLoaderData("root");

  // TODO AJO fix this
  const user = { identifier: "ajo@ason.ch" };

  return (
    <MuiDrawer 
      variant="permanent"
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
        <Stack>
          <CompanySelector currentCompany={tenant} />
        </Stack>
      </Toolbar>
      <Divider />
      <Stack sx={{flexGrow: 1, border: 0, borderRight: 1, borderStyle: 'solid', borderColor: 'divider'}}>
        <Menu navigation={navigation} sx={{flexGrow: 1}} />
        <Divider />
        <Box sx={{p: 2}}>
          <PayrollSelector />
          <TextField
            id="user-email"
            label="User"
            variant="standard"
            disabled
            InputLabelProps={{ shrink: true }}
            value={user.identifier}
          />

          <TextField
            id="user-tenant"
            label="Company"
            variant="standard"
            disabled
            InputLabelProps={{ shrink: true }}
            defaultValue={tenant.identifier}
          />
        </Box>
      </Stack>
    </MuiDrawer>
  )
};

export default Drawer;
