import React, { Suspense } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Form, Link, useLoaderData } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { ContentLayout } from "../components/ContentLayout";
import { useRole } from "../user/utils";
import { Button, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Organization } from "../models/Organization";
import { ResponsiveDialog, ResponsiveDialogClose, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../components/ResponsiveDialog";
import { Add } from "@mui/icons-material";

export function OrganizationList() {
	const organizations = useLoaderData() as Array<Organization>;
	const { t } = useTranslation();
	useDocumentTitle(`Ason - ${t("Organizations")}`);
	return (
		<ContentLayout title={t("Select an organization")} buttons={<ButtonStack />}>
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

function ButtonStack() {
	return (
		<Suspense>
			<Stack direction="row" spacing={1}>
				<CreateOrganizationButton />
				<ImportButton />
			</Stack>
		</Suspense>
	)
}

function ImportButton() {
	const { t } = useTranslation();
	const isInstanceAdmin = useRole("InstanceAdmin");
	if (!isInstanceAdmin)
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

function CreateOrganizationButton() {
	const { t } = useTranslation();
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger>
				<Tooltip title={t("Create organization")} placement="top" arrow>
					<IconButton
						color="primary"
						size="small"
					>
						<Add />
					</IconButton>
				</Tooltip>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
			<Form method="POST">
				<Stack spacing={2}>
				<Typography variant="h6">{t("Create organization")}</Typography>
				<TextField name="org_name" placeholder={t("Organization name")}/>
				<Stack direction="row" justifyContent="end" spacing={1}>
					<ResponsiveDialogClose>
						<Button>{t("Cancel")}</Button>
					</ResponsiveDialogClose>
					<Button type="submit" variant="contained" color="primary">{t("Create")}</Button>
				</Stack>
				</Stack>
			</Form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}