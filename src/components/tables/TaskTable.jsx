import { React, forwardRef } from "react";
import { Link as RouterLink, useAsyncValue, useParams, Outlet } from "react-router-dom";
import { Stack, Typography, Paper, Chip, Divider, IconButton, Tooltip, Avatar, useTheme, useMediaQuery } from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Person, Schedule } from "@mui/icons-material";
import { useStringColor } from "../../theme";
import { CategoryLabel } from "../tasks/CategoryLabel";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      "color": theme.palette.primary.main,
      "backgroundColor": theme.palette.primary.hover
    }
  }
});

export function AsyncTaskTable() {
  return (
    <ContentLayout title="Tasks" disableXsPadding>
      <AsyncDataRoute>
        <TaskTable />
      </AsyncDataRoute>
    </ContentLayout>
  );
}

function TaskTable() {
  const tasks = useAsyncValue();
  const theme = useTheme();
  const mobileLayout = useMediaQuery(theme.breakpoints.down("md"));
  const rowVariant = mobileLayout ? "mobile" : "default";

  return (
    <Paper>
      <Stack divider={<Divider />}>
        {tasks.map((task, index) => <TaskRow key={index} task={task} variant={rowVariant}/>)}
      </Stack>
    </Paper>
  );
};

function TaskRow({ task, variant }) {
  const { t } = useTranslation();
  let stackDirection = "row";
  let rowInfoSpacing = 0.5;
  if (variant === "mobile") {
    stackDirection = "column";
    rowInfoSpacing = 0.75;
  }
  return (
    <Link to={task.id + ""} state={{task}}>
      <Stack spacing={2} p={2} direction={stackDirection} alignItems="center">
        <Stack spacing={0.5} flex={1}>
          <CategoryLabel label={task.displayCategory} sx={{height: 20, alignSelf: "start"}}/>
          <Typography fontWeight="bold" fontSize="1rem">{task.displayName}&nbsp;(#{task.id})</Typography>
        </Stack>
        { task.employee && <RowInfo icon={<Person fontSize="small"/>} label={t("Employee")} spacing={rowInfoSpacing}><Typography>{task.employee.firstName} {task.employee.lastName}</Typography></RowInfo>}
        { variant !== "mobile" && task.assignedUser && <AssignedUserAvatar user={task.assignedUser} />}
        <RowInfo icon={<Schedule fontSize="small"/>} label={t("Due on")} spacing={rowInfoSpacing}><Typography>{formatDate(task.scheduled)}</Typography></RowInfo>
      </Stack>
    </Link>
  );
}

function RowInfo({icon, label, spacing, children}) {
  return (
    <Tooltip title={label} placement="top">
      <Stack direction="row" alignItems="center" spacing={spacing}>
        {icon}
        {children}
      </Stack>
    </Tooltip>
  )
}

function AssignedUserAvatar({user}) {
  const { t } = useTranslation();
  const name = `${user.firstName} ${user.lastName}`;
  const color = useStringColor(name);
  return (
    <Tooltip title={t("Assignee")} placement="top" >
      <Avatar sx={{bgcolor: color, width: 28, height: 28}}>
        <Typography variant="body2" lineHeight={1}>{user.firstName[0]}{user.lastName[0]}</Typography>
      </Avatar>
    </Tooltip>
  )
}

