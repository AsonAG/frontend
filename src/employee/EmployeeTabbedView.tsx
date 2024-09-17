import React from "react";
import {
	useLoaderData,
	NavLink as RouterLink,
} from "react-router-dom";
import { PageHeaderTitle } from "../components/ContentLayout";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit } from "@mui/icons-material";
import { StatusChip } from "../scenes/employees/StatusChip";
import { StatusEnum } from "../models/StatusEnum";
import { EventTabbedView } from "../components/EventTabbedView";

type LoaderData = {
	pageTitle: string
	status: StatusEnum
}

export function EmployeeTabbedView() {
	const { pageTitle, status } = useLoaderData() as LoaderData;
	const { t } = useTranslation();


	const titleComponent = (
		<Stack direction="row" spacing={1} flex={1} alignItems="center" width="100%">
			<PageHeaderTitle title={pageTitle} />
			<Tooltip title={t("Edit employee")} placement="top" arrow>
				<IconButton
					component={RouterLink}
					to="edit"
					color="primary"
					size="small"
				>
					<Edit />
				</IconButton>
			</Tooltip>
			<StatusChip status={status} />
		</Stack>
	);
	return <EventTabbedView title={titleComponent} showMissingData />;
}
