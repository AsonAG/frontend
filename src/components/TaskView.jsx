import { React, useState } from "react";
import {
	useAsyncValue,
	useLocation,
	Link,
	useSubmit,
	Outlet,
	useRouteLoaderData,
	useNavigation,
} from "react-router-dom";
import { Stack, Typography, Button, TextField } from "@mui/material";
import { HtmlContent } from "./HtmlContent";
import { ContentLayout } from "./ContentLayout";
import { Loading } from "./Loading";
import { useTranslation } from "react-i18next";
import { AsyncDataRoute } from "../routes/AsyncDataRoute";
import { formatDate } from "../utils/DateUtils";
import { CategoryLabel } from "./CategoryLabel";
import { getEmployeeDisplayString } from "../models/Employee";
import { DocumentSection } from "../payrun/PeriodDocuments";

export function AsyncTaskView() {
	const { t } = useTranslation();
	const { state } = useLocation();
	const taskName = state?.task ? state.task.displayName : t("Loading...");
	const loadingElement = (
		<ContentLayout title={taskName}>
			<Loading />
		</ContentLayout>
	);
	return (
		<>
			<AsyncDataRoute loadingElement={loadingElement} skipDataCheck>
				<TaskView />
			</AsyncDataRoute>
			<Outlet />
		</>
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
	const submit = useSubmit();
	const navigation = useNavigation();
	const isExecuting = navigation.state !== "idle";
	const { userMembership } = useRouteLoaderData("root");
	const taskCompleted = task.completed !== null;
	const taskComment = task.comment || "";
	const [comment, setComment] = useState(taskComment);
	const backLink = useBacklink();
	let saveCommentText = t("Save comment");
	const submitPost = (payload) =>
		submit(payload, {
			method: "post",
			encType: "application/json",
		});

	const saveComment = () =>
		submitPost({ task, comment, action: "saveComment" });
	let primaryAction;
	let buttonText;
	if (taskCompleted) {
		primaryAction = saveComment;
		buttonText = saveCommentText;
	} else if (task.assignedUserId !== userMembership.userId) {
		primaryAction = () => submitPost({ task, action: "accept" });
		buttonText = t("Accept task");
	} else {
		primaryAction = () => submitPost({ task, comment, action: "complete" });
		buttonText =
			comment !== taskComment ? t("Save comment & complete") : t("Complete");
	}

	return (
		<ContentLayout title={task.displayName}>
			<Stack spacing={2}>
				<CategoryLabel
					label={task.displayCategory}
					sx={{ alignSelf: "start" }}
				/>
				{taskCompleted && (
					<Stack>
						<Typography variant="h6" gutterBottom>
							{t("Completed on")}
						</Typography>
						<Typography>{formatDate(task.completed)}</Typography>
					</Stack>
				)}
				<Stack>
					<Typography variant="h6" gutterBottom>
						{t("Assigned to")}
					</Typography>
					<Typography>
						{task.assignedUser
							? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
							: t("not assigned")}
					</Typography>
				</Stack>
				{task.employee && (
					<Stack>
						<Typography variant="h6" gutterBottom>
							{t("Employee")}
						</Typography>
						<Link to={`../hr/employees/${task.employee.id}/events`}>
							<Typography>{getEmployeeDisplayString(task.employee)}</Typography>
						</Link>
					</Stack>
				)}
				<Stack>
					<Typography variant="h6" gutterBottom>
						{t("Due on")}
					</Typography>
					<Typography>{formatDate(task.scheduled)}</Typography>
				</Stack>
				<Stack>
					<Typography variant="h6" gutterBottom>
						{t("Instructions")}
					</Typography>
					<HtmlContent content={task.displayInstruction} />
				</Stack>
				<Stack>
					<Typography variant="h6" gutterBottom>
						{t("Files")}
					</Typography>
					{(task.attachments?.length ?? 0 > 0) ? (
						task.attachments.map((attach) => {
							return (
								<DocumentSection
									key={attach.id}
									docBasePath="attachments"
									document={attach}
								></DocumentSection>
							);
						})
					) : (
						<Typography>{t("No files attached.")}</Typography>
					)}
				</Stack>
				{task.hasAction && (
					<Stack alignItems="start">
						<Button
							variant="outlined"
							loading={isExecuting}
							loadingPosition="start"
							disabled={taskCompleted && taskComment === comment}
							onClick={() => submitPost({ action: "runAction" })}
						>
							<Typography>{t("Generate files...")}</Typography>
						</Button>
					</Stack>
				)}
				<Stack>
					<Typography variant="h6" gutterBottom>
						{t("Comment")}
					</Typography>
					<TextField
						multiline
						rows={5}
						value={comment}
						onChange={(event) => setComment(event.target.value)}
					/>
					{!taskCompleted && (
						<Button
							variant="outlined"
							loading={isExecuting}
							loadingPosition="start"
							disabled={taskComment === comment}
							sx={{ alignSelf: "end", my: 1 }}
							onClick={saveComment}
						>
							<Typography>{saveCommentText}</Typography>
						</Button>
					)}
				</Stack>
				<Stack direction="row" spacing={1} justifyContent="end">
					<Button component={Link} to={backLink} relative="path">
						<Typography>{t("Back")}</Typography>
					</Button>
					<Button
						variant="contained"
						loading={isExecuting}
						loadingPosition="start"
						disabled={taskCompleted && taskComment === comment}
						onClick={primaryAction}
					>
						<Typography>{t(buttonText)}</Typography>
					</Button>
				</Stack>
			</Stack>
		</ContentLayout>
	);
}
