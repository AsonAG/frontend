import { useContext, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import TaskIcon from "@mui/icons-material/Task";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserContext } from "../../App";

const Sidebar = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const minWidth = useMediaQuery("(min-width:600px)");
  const { user, setUser } = useContext(UserContext);

  const Item = ({ title, to, icon, selected, setSelected }) => {
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

  return (
    (minWidth || !isCollapsed) && (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
            // position: "-webkit-sticky",
            // position: 'sticky !important',
            top: "0",
            maxWidth: "250px",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "0px 20px 10px 20px !important",
            // padding: "0px 10px 16px 20px !important",
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
              <Box marginTop="20px">
                <Item
                  title="Dashboard"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  sx={{ m: "10px 0" }}
                  textAlign="center"
                >
                  Employee
                </Typography>
                <Item
                  title="Tasks"
                  to="/tasks"
                  icon={<TaskIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Report a case"
                  to="/reporting"
                  // icon={<PeopleOutlinedIcon />}
                  icon={<ContactsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant="h5"
                  color={colors.grey[300]}
                  sx={{ m: "10px 0" }}
                  textAlign="center"
                >
                  HR
                </Typography>
                <Item
                  title="Employees"
                  to="/employees"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Company Cases"
                  to="/company"
                  icon={<CasesOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Company Data"
                  to="/companyData"
                  icon={<ApartmentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Documents"
                  to="/form"
                  icon={<DescriptionOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              /> */}
              </Box>
            </Menu>

            {(minWidth && !isCollapsed) && (<Box>
              <Box display="flex" justifyContent="left" alignItems="left">
                {/* <img
                  alt="profile-user"
                  width="120px"
                  height="120px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                /> */}
              </Box>
              <Box textAlign="left" sx={{ m: "0 10px 20px 30px" }}>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                >
                  {user.payrollName}
                </Typography>
                <Typography variant="h6" color={colors.grey[100]}>
                  {user.employeeId}
                </Typography>
              </Box>
            </Box>)}
          </Box>
        </ProSidebar>
      </Box>
    )
  );
};

export default Sidebar;
