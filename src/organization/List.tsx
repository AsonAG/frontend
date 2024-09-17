import React, { Suspense } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLoaderData } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../components/ContentLayout";
import { useRole } from "../hooks/useRole";
import { IconButton, Tooltip } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Organization } from "../models/Organization";

export function OrganizationList() {
	const organizations = useLoaderData() as Array<Organization>;
	const { t } = useTranslation();
	useDocumentTitle(`Ason - ${t("Organizations")}`);
	return (
		<ContentLayout title={t("Select an organization")} buttons={<Suspense><ImportButton /></Suspense>}>
			<Paper>
				<List>
					{organizations.map((org) => (
						<ListItem disablePadding key={org.id}>
							<ListItemButton
								component={Link}
								to={org.id}
								state={{ org }}
							>
								<ListItemText primary={org.identifier} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Paper>
		</ContentLayout>
	);
}

function ImportButton() {
	const { t } = useTranslation();
	const isProvider = useRole("provider");
	if (!isProvider)
		return null;

	return (
		<Tooltip title={t("Import organization")} placement="top" arrow>
			<IconButton
				component={Link}
				to="import"
				color="primary"
				size="small"
			>
				<FileUploadIcon />
			</IconButton>
		</Tooltip>
	)
}
