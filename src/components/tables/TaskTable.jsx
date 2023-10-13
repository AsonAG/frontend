import { React, useState } from "react";
import { useAsyncValue } from "react-router-dom";
import { Stack, Typography, Paper, Button, Chip, Divider, IconButton } from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { HtmlContent } from '../HtmlContent';

export function TaskTable() {
  const tasks = useAsyncValue();

  return (
    <Paper>
      <Stack spacing={1} divider={<Divider />} py={1}>
        {tasks.map((task, index) => <TaskRow key={index} task={task} />)}
      </Stack>
    </Paper>
  );
};

function TaskRow({ task }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} px={1}>
      <TaskButton isCompleted={task.completed !== null} />
      <Stack spacing={0.5} width={225}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight="bold">{task.name}</Typography>
          <Chip label={task.category} variant="outlined" size="small" sx={{height: 20}}/>
        </Stack>
        <Typography variant="body2">#{task.id} - Assigned on {formatDate(task.scheduled)}</Typography>
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