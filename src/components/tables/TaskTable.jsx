import { React, useState, forwardRef } from "react";
import { Link as RouterLink, useAsyncValue, useParams, Outlet } from "react-router-dom";
import { Stack, Typography, Paper, Button, Chip, Divider, IconButton, Tooltip } from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HtmlContent } from '../HtmlContent';
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/useIsMobile";
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
        <RowInfo icon={<Person />} label={t("Employee")}><Typography>Aleksandar Josipovic</Typography></RowInfo>
        <RowInfo icon={<Schedule />} label={t("Due on")}>{formatDate(task.scheduled)}</RowInfo>
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