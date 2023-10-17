
import { React, useState } from "react";
import { useAsyncValue, useLocation, Link } from "react-router-dom";
import { Stack, Typography, Paper, Button, Chip, Divider, IconButton, Box, TextField, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { HtmlContent } from './HtmlContent';
import { ContentLayout } from "./ContentLayout";
import { Loading } from "./Loading";
import { useTranslation } from "react-i18next";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { formatDate } from "../utils/DateUtils";

export function AsyncTaskView() {
  const taskName = useLocation() || "Loading...";
  const loadingElement = <ContentLayout title={taskName}><Loading /></ContentLayout>;
  return (
    <AsyncDataRoute loadingElement={loadingElement} skipDataCheck>
      <TaskView />
    </AsyncDataRoute>
  );
}

function TaskView() {
  const task = useAsyncValue();
  const { t } = useTranslation();
  const title = `${task.name} (#${task.id})`;
  const taskCompleted = task.completed !== null;
  const taskComment = task.comment || "";
  const [comment, setComment] = useState(taskComment);
  let completeText = t("Complete");
  let commentText = t("Save comment");
  let buttonText = taskCompleted ? commentText : completeText;
  if (!taskCompleted && comment !== taskComment) {
    buttonText = t("Save comment & complete");
  }
  return (
    <ContentLayout title={title}>
      <Stack spacing={2}>
        <Chip label={task.category} variant="outlined" size="small" sx={{alignSelf: "start" }}/>
        {
          taskCompleted &&
            <Stack>
              <Typography variant="h6" gutterBottom>{t("Completed on")}</Typography>
              <Typography>{formatDate(task.completed)}</Typography>
            </Stack>
        }
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Assigned to")}</Typography>
          <Typography>{task.assignedUserId}</Typography>
        </Stack>
        {
          task.employeeIdentifier &&
            <Stack>
              <Typography variant="h6" gutterBottom>{t("Employee")}</Typography>
              <Typography>{task.employeeIdentifier}</Typography>
            </Stack>
        }
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Due on")}</Typography>
          <Typography>{formatDate(task.scheduled)}</Typography>
        </Stack>
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Instructions")}</Typography>
          <HtmlContent content={task.instruction} />
        </Stack>
        <Stack>
          <Typography variant="h6" gutterBottom>{t("Comments")}</Typography>
          <TextField multiline rows={5} value={comment} onChange={event => setComment(event.target.value)}/>
          { !taskCompleted && <Button variant="outlined" disabled={taskComment === comment} sx={{alignSelf: "end", my: 1}}><Typography>{t("Save comment")}</Typography></Button> }
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="end">
          <Button component={Link} to=".." relative="path"><Typography>{t("Cancel")}</Typography></Button>
          <Button variant="contained" disabled={taskCompleted && taskComment === comment}><Typography>{t(buttonText)}</Typography></Button>
        </Stack>
      </Stack>
    </ContentLayout>
  );
}
