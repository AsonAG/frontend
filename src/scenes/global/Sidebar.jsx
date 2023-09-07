import { useContext, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { Link, useRouteLoaderData } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import PayrollSelector from "../../components/selectors/PayrollSelector";
import { Stack } from "@mui/system";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CasesOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";

const Sidebar = ({ isCollapsed }) => {
  const { tenant } = useRouteLoaderData("root");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const minWidth = useMediaQuery("(min-width:600px)");
  const [selected, setSelected] = useState("/");

  // TODO AJO fix this
  const user = {identifier: "ajo@ason.ch", tenantIdentifier: "Blabla"};

  const Item = ({ title, to, icon }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === to}
        style={{
          color: colors.grey[100],
        }}
        onClick={() => setSelected(to)}
        icon={icon}
      >
        {!isCollapsed && (
          <div>
            <Typography>{title}</Typography>
          </div>
        )}
        {isCollapsed ? (
          <Tooltip title={title} placement="right">
            <Link to={to} />
          </Tooltip>
        ) : (
          <Link to={to} />
        )}
      </MenuItem>
    );
  };

  return (
    (minWidth || !isCollapsed) && (
      <Box
        // display="flex" flexDirection="row"
        sx={{
          ".pro-sidebar": {
            minWidth: "230px",
            maxWidth: "230px",
          },
          ".pro-sidebar.collapsed": {
            minWidth: "inherit",
          },
          "& .pro-sidebar-inner": {
            // overflowY: "scroll",
            background: `${colors.primary[400]} !important`,
            // position: "-webkit-sticky",
            // position: 'sticky !important',
            // top: "0",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-sidebar": {
            color: colors.grey[100] + " !important",
          },
          "& .pro-inner-item": {
            color: colors.grey[100] + " !important",
            // padding: "0px 20px 10px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: colors.blueAccentReverse + "!important",
          },
          "& .pro-menu-item.active .pro-inner-item": {
            color: colors.blueAccent + "!important",
          },
        }}
      >
        {/*  TODO: use Drawer for mobile devices
        <Drawer
          variant="permanent"
          // flexShrink="10"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
            // width: drawerWidth 
          },
          }}
          open
        > */}
        <ProSidebar collapsed={isCollapsed}>
          <Box
            height="100%"
            // position="sticky"
            position="-webkit-sticky"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Menu>
              <Box>
                <Item title="Dashboard" to="/" icon={<HomeIcon />} />

                <Divider />

                <SubMenu defaultOpen icon={<WorkIcon />} title="HR">
                  <Item
                    title="Employees"
                    to="hr/employees"
                    icon={<PeopleOutlinedIcon />}
                  />
                  <SubMenu
                    defaultOpen
                    icon={<ApartmentOutlinedIcon />}
                    title="Company"
                  >
                    <Item
                      title="New event"
                      to="/company"
                      icon={<AddOutlinedIcon />}
                    />
                    <Item
                      title="Data"
                      to="/companyData"
                      icon={<CasesOutlinedIcon />}
                    />
                    <Item
                      title="Events"
                      to="/companyEvents"
                      icon={<WorkHistoryOutlinedIcon />}
                    />
                    <Item
                      title="Documents"
                      to="/companyDocuments"
                      icon={<DescriptionOutlinedIcon />}
                    />
                  </SubMenu>
                </SubMenu>

                <Divider />

                <SubMenu defaultOpen icon={<PersonIcon />} title="Employee">
                  <Item
                    title="New event"
                    to="/ESS"
                    icon={<AddOutlinedIcon />}
                  />
                  <Item
                    title="My Profile"
                    to="/personalData"
                    icon={<PersonOutlineOutlinedIcon />}
                  />
                  <Item
                    title="Tasks"
                    to="/ECT"
                    icon={<FormatListBulletedIcon />}
                  />
                  <Item
                    title="Documents"
                    to="/personalDocuments"
                    icon={<DescriptionOutlinedIcon />}
                  />
                </SubMenu>
              </Box>
            </Menu>

            {minWidth && !isCollapsed && (
              <Box>
                <Box display="flex" justifyContent="left" alignItems="left">
                </Box>
                <Stack sx={{ m: "0 30px 20px " }} spacing={1.5}>
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
                </Stack>
              </Box>
            )}
          </Box>
        </ProSidebar>
      </Box>
    )
  );
};

export default Sidebar;
