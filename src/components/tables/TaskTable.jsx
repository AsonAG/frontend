import { React, useState, forwardRef } from "react";
import { Link as RouterLink, useAsyncValue, useParams, Outlet } from "react-router-dom";
import { Stack, Typography, Paper, Button, Chip, Divider, IconButton } from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HtmlContent } from '../HtmlContent';
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

const Link = styled(forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />;
}))(({theme}) => {
  return {
    textDecoration: "none",
    color: theme.palette.text.primary,
    "&:hover": {
      "color": theme.palette.primary.main,
    }
  }
});

export function AsyncTaskTable() {
  return (
    <ContentLayout title="Tasks">
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
      <Stack spacing={1} divider={<Divider />} py={1}>
        {tasks.map((task, index) => <TaskRow key={index} task={task} />)}
      </Stack>
    </Paper>
  );
};

const taskRowSx = {
  "&:hover": {
    backgroundColor: (theme) => theme.palette.main.hover
  }
};

function TaskRow({ task }) {
  const { t } = useTranslation();
  return (
    <Stack direction="row" alignItems="center" spacing={1} px={1} sx={taskRowSx}>
      <Stack spacing={0.5} width={225}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link to={task.id + ""}>
            <Typography fontWeight="bold">{task.name}</Typography>
          </Link>
          <Chip label={task.category} variant="outlined" size="small" sx={{height: 20}}/>
        </Stack>
        <Typography variant="body2">#{task.id} - {t("Due on")} {formatDate(task.scheduled)}</Typography>
      </Stack>
      <Typography><HtmlContent content={task.instruction} /></Typography>
    </Stack>
  );
}

function TaskButton({isCompleted, onClick}) {
  const [hover, setHover] = useState(false);
  const icon = isCompleted ? <CheckCircleIcon /> : 
    hover ? <CheckCircleOutlinedIcon /> : <CircleOutlinedIcon />;
  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);
  return (
     <IconButton color="primary" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{icon}</IconButton>
  ); 
}