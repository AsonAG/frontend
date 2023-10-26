import {
  Box,
  Divider,
  Toolbar,
  Drawer as MuiDrawer,
  Typography,
  Badge} from "@mui/material";
import { forwardRef, useEffect } from "react";
import { NavLink as RouterLink, useLoaderData, useLocation } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { openTasksAtom } from "../../utils/dataAtoms";

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
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.hover
    },
    "&.active": {
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.active
    },
    "&.active:hover": {
      "color": theme.palette.primary.light,
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

function OpenTasksBadgeIcon() {
  const tasks = useAtomValue(openTasksAtom);
  return withBadge(tasks.count, <FormatListBulletedIcon />);
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

const badgeSx = {badge: {sx: {height: 16, minWidth: 16, letterSpacing: 0, pl: 0.625, pr: 0.5}}};

function withBadge(count, icon) {
  return (
    <Badge badgeContent={count} color="primary" slotProps={badgeSx}>
      {icon}
    </Badge>
  )
}

const drawerWidth = 265;
function Drawer({ temporary, open, onClose }) {
  const { tenant, user, employee } = useLoaderData();
  const location = useLocation();
  const { t } = useTranslation();

	useEffect(onClose, [location])

  const drawerVariant = temporary ? "temporary" : "permanent";
  const isHrUser = user?.attributes.roles?.includes("hr");

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
          <Typography variant="body2" color="text.secondary" fontWeight="bold" px={1} >{t("Business Unit")}</Typography>
          <PayrollSelector/>
        </Stack>
      </Toolbar>
      <Divider />
      <Stack sx={{flexGrow: 1, border: 0, borderRight: 1, borderStyle: 'solid', borderColor: 'divider', overflowY: 'auto'}}>
        <NavigationMenu>
          <NavigationGroup>
            <NavigationItem label={t("Dashboard")} to="" icon={<HomeIcon />} end />
          </NavigationGroup>
          <NavigationGroup name={t("HR")} hidden={!isHrUser}>
            <NavigationItem label={t("Employees")} to="hr/employees" icon={<PeopleOutlinedIcon />} />
            <NavigationItem label={t("Tasks")} to="hr/tasks" icon={<OpenTasksBadgeIcon />} />
          </NavigationGroup>
          <NavigationGroup name={t("Company")} hidden={!isHrUser}>
            <NavigationItem label={t("New event")} to="company/new" icon={<AddOutlinedIcon />} />
            <NavigationItem label={t("Data")} to="company/data" icon={<CasesOutlinedIcon />} end />
            <NavigationItem label={t("Events")} to="company/events" icon={<WorkHistoryOutlinedIcon />} end />
            <NavigationItem label={t("Documents")} to="company/documents" icon={<DescriptionOutlinedIcon />} />
          </NavigationGroup>
          <NavigationGroup name={t("Employee")} hidden={employee === null}>
            <NavigationItem label={t("New event")} to={`employees/${employee?.id}/new`} icon={<AddOutlinedIcon />} />
            <NavigationItem label={t("My Profile")} to={`employees/${employee?.id}/data`} icon={<PersonOutlineOutlinedIcon />} end />
            <NavigationItem label={t("Tasks")} to={`employees/${employee?.id}/tasks`} icon={<FormatListBulletedIcon />} />
            <NavigationItem label={t("Documents")} to={`employees/${employee?.id}/documents`} icon={<DescriptionOutlinedIcon />} />
          </NavigationGroup>
        </NavigationMenu>
        <Divider />
        <Stack sx={{p: 2}} spacing={1}>
          <Typography>{t("Company")}</Typography>
          <Stack spacing={1} direction="row">
            <Typography variant="body2" textOverflow="ellipsis" overflow="hidden">{tenant.identifier}</Typography>
            <Typography 
              component={RouterLink} 
              variant="body2" 
              color="primary.main" 
              to="/tenants" 
              sx={{
                textDecoration: "none",
                "&: hover": {
                  fontWeight: "bold"
                }
              }}
            >
              {t("Select...")}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <UserAccountComponent user={user} sx={{p: 2}} />
      </Stack>
    </MuiDrawer>
  )
};

export default Drawer;
