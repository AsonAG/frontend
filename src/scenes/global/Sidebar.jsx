import { useContext, useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import TaskIcon from "@mui/icons-material/Task";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserContext, UserEmployeeContext } from "../../App";
import PayrollSelector from "../../components/PayrollSelector";
import { useAuth } from "oidc-react";
import { Stack } from "@mui/system";

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      {!isCollapsed && (
        <div>
          <Typography>{title}</Typography>
        </div>
      )}
      <Tooltip title={title}>
        <Link to={to} />
      </Tooltip>
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const minWidth = useMediaQuery("(min-width:600px)");
  const auth = useAuth();
  const { user, setUser } = useContext(UserContext);
  const userEmployee = useContext(UserEmployeeContext);

  return (
    (minWidth || !isCollapsed) && (
      <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          // position: "-webkit-sticky",
          // position: 'sticky !important',
          // top: "0",
          // maxWidth: "250px",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-sidebar": {
          color: colors.grey[100] + " !important"
        },
        "& .pro-inner-item": {
          color: colors.grey[100] + " !important"
          // padding: "0px 20px 10px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Box
            height="100%"
            position="sticky"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Menu>
              <Box marginTop="10px">
                <Item
                  title="Dashboard"
                  to="/"
                  icon={<HomeIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  isCollapsed={isCollapsed}
                />

                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  // sx={{ m: "10px 0" }}
                  textAlign="center"
                ></Typography>

                <SubMenu defaultOpen icon={<WorkIcon />} title="HR">
                  <Item
                    title="Employees"
                    to="/employees"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                  <Item
                    title="Company Cases"
                    to="/company"
                    icon={<CasesOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                  <Item
                    title="Company Data"
                    to="/companyData"
                    icon={<ApartmentOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                  <Item
                    title="Documents"
                    to="/form"
                    icon={<DescriptionOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                </SubMenu>

                {/* <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
               */}

                <SubMenu icon={<PersonIcon />} title="Employee">
                  <Item
                    title="Tasks"
                    to="/tasks"
                    icon={<TaskIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />
                  <Item
                    title="Cases"
                    to="/reporting"
                    // icon={<PeopleOutlinedIcon />}
                    icon={<ContactsOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                  />

                  <Typography
                    variant="h5"
                    color={colors.grey[300]}
                    sx={{ m: "10px 0" }}
                    textAlign="center"
                  ></Typography>
                </SubMenu>
              </Box>
            </Menu>

            {minWidth && !isCollapsed && (
              <Box>
                <Box display="flex" justifyContent="left" alignItems="left">
                  {/* <img
                  alt="profile-user"
                  width="120px"
                  height="120px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                /> */}
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
                    // defaultValue={auth.userData?.profile?.email}
                  />

                  <TextField
                    id="user-tenant"
                    label="Tenant"
                    variant="standard"
                    disabled
                    InputLabelProps={{ shrink: true }}
                    defaultValue={user.tenantIdentifier}
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
