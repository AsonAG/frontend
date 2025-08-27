import React from "react";
import { NavLink as RouterLink, useRouteLoaderData } from "react-router-dom";
import { PageHeaderTitle } from "../components/ContentLayout";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit } from "@mui/icons-material";
import { StatusDot } from "./StatusDot";
import { EventTabbedView } from "../components/EventTabbedView";

type LoaderData = {
	pageTitle: string;
	isEmployed: boolean;
};

export function EmployeeTabbedView() {
	const { pageTitle, isEmployed } = useRouteLoaderData(
		"employee",
	) as LoaderData;
	const { t } = useTranslation();

	const titleComponent = (
		<Stack
			direction="row"
			spacing={1}
			flex={1}
			alignItems="center"
			width="100%"
		>
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
			<StatusDot isEmployed={isEmployed} />
		</Stack>
	);
	return <EventTabbedView title={titleComponent} />;
}
