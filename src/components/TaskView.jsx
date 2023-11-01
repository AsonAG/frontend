
import { React, useRef, useState } from "react";
import { useAsyncValue, useLocation, Link, useRouteLoaderData, useSubmit } from "react-router-dom";
import { Stack, Typography, Button,  TextField } from "@mui/material";
import { HtmlContent } from './HtmlContent';
import { ContentLayout } from "./ContentLayout";
import { Loading } from "./Loading";
import { useTranslation } from "react-i18next";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { formatDate } from "../utils/DateUtils";
import dayjs from "dayjs";
import { CategoryLabel } from "./tasks/CategoryLabel";

const getTaskTitle = (task) => `${task.displayName} (#${task.id})`;

export function AsyncTaskView() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const taskName = state?.task ? getTaskTitle(state.task) : t("Loading...");
  const loadingElement = <ContentLayout title={taskName}><Loading /></ContentLayout>;
  return (
    <AsyncDataRoute loadingElement={loadingElement} skipDataCheck>
      <TaskView />
    </AsyncDataRoute>
  );
}

function useBacklink() {
  const { state } = useLocation();
  let backLinkPath = "..";
  if (state?.taskFilter) {
    backLinkPath += state.taskFilter;
  }
  return backLinkPath;
}

function TaskView() {
  const task = useAsyncValue();
  const { t } = useTranslation();
  const { user } = useRouteLoaderData("root");
  const submit = useSubmit();
  const title = getTaskTitle(task);
  const taskCompleted = task.completed !== null;
  const taskComment = task.comment || "";
  const [comment, setComment] = useState(taskComment);
  const backLink = useBacklink();
  const backLinkRef = useRef(backLink);
  let completeText = t("Complete");
  let commentText = t("Save comment");
  let buttonText = taskCompleted ? commentText : completeText;
  if (!taskCompleted && comment !== taskComment) {
    buttonText = t("Save comment & complete");
  }
  const acceptTask = () => submit({...task, assignedUserId: user.id}, { method: "post", encType: "application/json" });
  const saveTask = (markCompleted) => {
    let newTask = null;
    if (markCompleted) {
      newTask = {...task, comment, completedUserId: user.id, completed: dayjs.utc().toISOString()};
    }
    else {
      newTask = {...task, comment}
    }
    
    submit(newTask, { method: "post", encType: "application/json" });
  }

  return (
    <ContentLayout title={title}>
      <Stack spacing={2}>
        <CategoryLabel label={task.displayCategory} sx={{alignSelf: "start" }} />
        {
          taskCompleted &&
            <Stack>
              <Typography variant="h6" gutterBottom>{t("Completed on")}</Typography>
              <Typography>{formatDate(task.completed)}</Typography>
            </Stack>
        }
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Assigned to")}</Typography>
          {
            task.assignedUser ?
              <Typography>{`${task.assignedUser.firstName} ${task.assignedUser.lastName}`}</Typography> :
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{t("not assigned")}</Typography>
                { !taskCompleted && <Button variant="outlined" onClick={acceptTask}>{t("Accept task")}</Button> }
              </Stack>
          }
        </Stack>
        {
          task.employee &&
            <Stack>
              <Typography variant="h6" gutterBottom>{t("Employee")}</Typography>
              <Link to={`../hr/employees/${task.employee.id}/data`}><Typography>{task.employee.firstName} {task.employee.lastName}</Typography></Link>
            </Stack>
        }
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Due on")}</Typography>
          <Typography>{formatDate(task.scheduled)}</Typography>
        </Stack>
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Instructions")}</Typography>
          <HtmlContent content={task.displayInstruction} />
        </Stack>
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Comment")}</Typography>
          <TextField multiline rows={5} value={comment} onChange={event => setComment(event.target.value)}/>
          { !taskCompleted && <Button variant="outlined" disabled={taskComment === comment} sx={{alignSelf: "end", my: 1}} onClick={() => saveTask(false)}><Typography>{t("Save comment")}</Typography></Button> }
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="end">
          <Button component={Link} to={backLinkRef.current} relative="path"><Typography>{t("Back")}</Typography></Button>
          <Button variant="contained" disabled={taskCompleted && taskComment === comment} onClick={() => saveTask(!taskCompleted)}><Typography>{t(buttonText)}</Typography></Button>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
