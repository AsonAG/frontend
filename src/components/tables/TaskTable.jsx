import { React, forwardRef } from "react";
import {
	Link as RouterLink,
	useAsyncValue,
	useLocation,
} from "react-router-dom";
import {
	Stack,
	Typography,
	Paper,
	Divider,
	Tooltip,
	Avatar,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { formatDate } from "../../utils/DateUtils";
import { AsyncDataRoute } from "../../routes/AsyncDataRoute";
import { ContentLayout } from "../ContentLayout";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Person, Schedule } from "@mui/icons-material";
import { CategoryLabel } from "../tasks/CategoryLabel";
import { TaskTableFilter } from "../tasks/TaskTableFilter";
import { TableButton } from "../buttons/TableButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { getEmployeeDisplayString } from "../../models/Employee";

const Link = styled(
	forwardRef(function Link(itemProps, ref) {
		return <RouterLink ref={ref} {...itemProps} role={undefined} />;
	}),
)(({ theme }) => {
	return {
		textDecoration: "none",
		color: theme.palette.text.primary,
		"&:hover": {
			color: theme.palette.primary.main,
			backgroundColor: theme.palette.primary.hover,
		},
	};
});

export function AsyncTaskTable() {
	const { t } = useTranslation();
	return (
		<ContentLayout title={t("Tasks")} buttons={<NewTaskButton />} disableInset>
			<AsyncDataRoute skipDataCheck>
				<TaskTable />
			</AsyncDataRoute>
		</ContentLayout>
	);
}

function TaskTable() {
	const tasks = useAsyncValue();
	const { t } = useTranslation();
	const { search } = useLocation();
	const theme = useTheme();
	const mobileLayout = useMediaQuery(theme.breakpoints.down("md"));
	const rowVariant = mobileLayout ? "mobile" : "default";
	const padding = "var(--content-inset)";

	return (
		<Stack spacing={3}>
			<TaskTableFilter stackProps={{ px: padding }} />
			{tasks.count === 0 ? (
				<Typography px={padding}>{t("No tasks found")}</Typography>
			) : (
				<Paper variant="outlined">
					<Stack divider={<Divider />}>
						{tasks.items.map((task) => (
							<TaskRow
								key={task.id}
								task={task}
								variant={rowVariant}
								taskFilter={search}
							/>
						))}
					</Stack>
				</Paper>
			)}
		</Stack>
	);
}

function NewTaskButton() {
	const { search } = useLocation();
	const { t } = useTranslation();
	return (
		<TableButton
			title={t("New task")}
			to="new"
			icon={<AddOutlinedIcon />}
			state={{ taskFilter: search }}
		/>
	);
}

function TaskRow({ task, variant, taskFilter }) {
	const { t } = useTranslation();
	let stackProps = {
		direction: "row",
		alignItems: "center",
		spacing: 2,
	};
	let rowInfoSpacing = 0.5;
	if (variant === "mobile") {
		stackProps = {
			spacing: 1,
		};
		rowInfoSpacing = 0.75;
	}
	return (
		<Link to={task.id + ""} state={{ task, taskFilter }}>
			<Stack spacing={2} p={2} {...stackProps}>
				<Stack spacing={0.5} flex={1}>
					<CategoryLabel
						label={task.displayCategory}
						sx={{ height: 20, alignSelf: "start" }}
					/>
					<Typography fontWeight="bold" fontSize="1rem">
						{task.displayName}&nbsp;(#{task.id})
					</Typography>
				</Stack>
				{task.employee && (
					<RowInfo
						icon={<Person fontSize="small" />}
						label={t("Employee")}
						spacing={rowInfoSpacing}
					>
						<Typography>
							{getEmployeeDisplayString(task.employee)}
						</Typography>
					</RowInfo>
				)}
				{variant !== "mobile" && task.assignedUser && (
					<AssignedUserAvatar user={task.assignedUser} />
				)}
				<RowInfo
					icon={<Schedule fontSize="small" />}
					label={t("Due on")}
					spacing={rowInfoSpacing}
				>
					<Typography>{formatDate(task.scheduled)}</Typography>
				</RowInfo>
			</Stack>
		</Link>
	);
}

function RowInfo({ icon, label, spacing, children }) {
	return (
		<Tooltip title={label} placement="top">
			<Stack direction="row" alignItems="center" spacing={spacing}>
				{icon}
				{children}
			</Stack>
		</Tooltip>
	);
}

function AssignedUserAvatar({ user }) {
	const { t } = useTranslation();
	const theme = useTheme();
	const name = `${user.firstName} ${user.lastName}`;
	return (
		<Tooltip title={t("Assignee")} placement="top">
			<Avatar sx={{ width: 28, height: 28, ...theme.bgColorFromString(name) }}>
				<Typography variant="body2" lineHeight={1}>
					{user.firstName[0]}
					{user.lastName[0]}
				</Typography>
			</Avatar>
		</Tooltip>
	);
}
