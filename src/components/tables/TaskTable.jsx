import { React, forwardRef } from "react";
import { Link as RouterLink, useAsyncValue, useParams, Outlet } from "react-router-dom";
import { Stack, Typography, Paper, Chip, Divider, IconButton, Tooltip, Avatar } from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Person, Schedule } from "@mui/icons-material";

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
  const { taskId } = useParams();

  if (taskId) {
    const taskNumber = Number(taskId);
    const task = tasks.find(t => t.id === taskNumber);
    return <Outlet context={task} />;
  }

  return (
    <Paper>
      <Stack divider={<Divider />}>
        {tasks.map((task, index) => <TaskRow key={index} task={task} />)}
      </Stack>
    </Paper>
  );
};

function TaskRow({ task }) {
  const { t } = useTranslation();
  return (
    <Link to={task.id + ""} state={{task}}>
      <Stack direction="row" alignItems="center" spacing={2} p={2} flexWrap="wrap">
        <Stack direction="row" alignItems="center" spacing={1} flex={1}>
          <Typography fontWeight="bold">{task.displayName}&nbsp;(#{task.id})</Typography>
          <Chip label={task.displayCategory} variant="outlined" size="small" sx={{height: 20}}/>
        </Stack>
        { task.employee && <RowInfo icon={<Person />} label={t("Employee")}><Typography>{task.employee.firstName} {task.employee.lastName}</Typography></RowInfo>}
        <RowInfo icon={<Schedule />} label={t("Due on")}>{formatDate(task.scheduled)}</RowInfo>
        {
          task.assignedUser &&
            <AssignedUserAvatar user={task.assignedUser} />
        }
      </Stack>
    </Link>
  );
}

function RowInfo({icon, label, children}) {
  return (
    <Tooltip title={label} placement="top">
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {icon}
        {children}
      </Stack>
    </Tooltip>
  )
}

function AssignedUserAvatar({user}) {
  const { t } = useTranslation();
  return (
    <Tooltip title={t("Assignee")} placement="top" >
      <Avatar sx={{bgcolor: stringToColor(user), width: 28, height: 28}}>
        <Typography variant="body2" lineHeight={1}>{user.firstName[0]}{user.lastName[0]}</Typography>
      </Avatar>
    </Tooltip>
  )
}

function stringToColor(user) {
  let hash = 0;
  let i;

  for (i = 0; i < user.firstName.length; i += 1) {
    hash = user.firstName.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < user.lastName.length; i += 1) {
    hash = user.lastName.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}