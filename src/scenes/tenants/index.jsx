import { React, Suspense } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLoaderData } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../../components/ContentLayout";
import { useRole } from "../../hooks/useRole";
import { IconButton, Tooltip } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';

export function TenantList() {
	const tenants = useLoaderData();
	const { t } = useTranslation();
	useDocumentTitle("Ason - Tenants");
	return (
		<ContentLayout title={t("Select a company")} buttons={<Suspense><ImportButton /></Suspense>}>
			<Paper>
				<List>
					{tenants.map((tenant) => (
						<ListItem disablePadding key={tenant.id}>
							<ListItemButton
								component={Link}
								to={tenant.id}
								state={{ tenant }}
							>
								<ListItemText primary={tenant.identifier} />
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
		<Tooltip title={t("Import tenant")} placement="top" arrow size="sm">
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
