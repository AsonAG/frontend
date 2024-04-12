import {
  Box,
  Divider,
  Toolbar,
  Drawer as MuiDrawer,
  Typography,
  Badge} from "@mui/material";
import { Suspense, forwardRef, useEffect } from "react";
import { NavLink as RouterLink, useLoaderData, useLocation } from "react-router-dom";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PayrollSelector from "../../components/selectors/PayrollSelector";
import { Stack } from "@mui/system";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import NotStartedOutlinedIcon from '@mui/icons-material/NotStartedOutlined';

import Logo from "../../components/Logo";
import styled from "@emotion/styled";
import { UserAccountComponent } from "./UserAccountComponent";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { openMissingDataTasksAtom, openTasksAtom } from "../../utils/dataAtoms";
import { Description, NotificationImportant  } from "@mui/icons-material";

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
  const icon = <FormatListBulletedIcon />;
  return (
    <Suspense fallback={icon}>
      <AtomBadge atom={openTasksAtom}>
        {icon}
      </AtomBadge>
    </Suspense>
  );
}

function MissingDataBadgeIcon() {
  const icon = <NotificationImportant />;
  const count = (data) => data.map(x => x.cases.length).reduce((a, b) => a+b, 0);
  return (
    <Suspense fallback={icon}>
      <AtomBadge atom={openMissingDataTasksAtom} countFunc={count}>
        {icon}
      </AtomBadge>
    </Suspense>
  )
}


function defaultCount(data) { return data.count };
function AtomBadge({atom, countFunc = defaultCount, children}) {
  const data = useAtomValue(atom);
  const count = countFunc(data);
  return (
    <Badge badgeContent={count} color="primary">
      {children}
    </Badge>
  )
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
  const { t } = useTranslation();

	useEffect(onClose, [location])

  const drawerVariant = temporary ? "temporary" : "permanent";
  const isHrUser = user?.attributes.roles?.includes("hr");

  return (
    <MuiDrawer 
      variant={drawerVariant}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 0
      }}
      sx={{
        width: drawerWidth,
        px: 0.5,
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
          <NavigationGroup name={t("HR")} hidden={!isHrUser}>
            <NavigationItem label={t("Employees")} to="hr/employees" icon={<PeopleOutlinedIcon />} />
            <NavigationItem label={t("Tasks")} to="hr/tasks" icon={<OpenTasksBadgeIcon />} />
            <NavigationItem label={t("Missing data")} to="hr/missingdata" icon={<MissingDataBadgeIcon />} />
            <NavigationItem label={t("Payruns")} to="hr/payruns" icon={<NotStartedOutlinedIcon />} />
            <NavigationItem label={t("Reports")} to="hr/reports" icon={<Description />} />
            {
              /*
              !import.meta.env.PROD && 
                <NavigationItem label={t("Compliance")} to="hr/compliance" icon={<AssuredWorkloadIcon />} />
              */
            }
          </NavigationGroup>
          <NavigationGroup name={t("Company")} hidden={!isHrUser}>
            <NavigationItem label={t("New event")} to="company/new" icon={<AddOutlinedIcon />} />
            <NavigationItem label={t("Missing data")} to="company/missingdata" icon={<NotificationImportant />} />
            <NavigationItem label={t("Events")} to="company/events" icon={<WorkHistoryOutlinedIcon />} end />
            <NavigationItem label={t("Documents")} to="company/documents" icon={<DescriptionOutlinedIcon />} />
          </NavigationGroup>
          <NavigationGroup name={t("Employee")} hidden={employee === null}>
            <NavigationItem label={t("New event")} to={`employees/${employee?.id}/new`} icon={<AddOutlinedIcon />} />
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
        <UserAccountComponent />
      </Stack>
    </MuiDrawer>
  )
};

export default Drawer;
