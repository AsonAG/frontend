import React from "react";
import { ContentLayout } from "../components/ContentLayout";
import {
	useActionData,
	useNavigation,
	useSubmit,
	Link,
} from "react-router-dom";
import {
	Button,
	Box,
	Stack,
	Typography,
	CircularProgress,
	Alert,
	Theme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import styled from "@emotion/styled";

const Dropzone = styled(Box, {
	shouldForwardProp: (prop) => prop !== "isDragActive",
})(({ theme, isDragActive }: { theme: Theme; isDragActive: boolean }) => {
	return {
		height: 300,
		cursor: "pointer",
		borderRadius: theme.spacing(1.5),
		padding: theme.spacing(2),
		borderStyle: "dashed",
		borderColor: theme.palette.divider,
		borderWidth: "thin",
		backgroundColor: isDragActive ? theme.palette.primary.hover : undefined,
	};
});

export function OrganizationImport() {
	const { t } = useTranslation();
	const submit = useSubmit();
	const actionData = useActionData() as string;
	const navigation = useNavigation();

	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
		useDropzone({
			maxFiles: 1,
			accept: {
				"application/zip": [".zip"],
			},
		});

	const isImporting = navigation.state === "submitting";
	let buttonText = t("Import");
	let fileSelected = false;
	let icon: React.JSX.Element | null = null;
	if (acceptedFiles[0]) {
		buttonText = t("import_organization_button", {
			fileName: acceptedFiles[0].name,
		});
		fileSelected = true;
	}
	if (isImporting) {
		buttonText = t("Importing") + "...";
		icon = (
			<CircularProgress
				size="1rem"
				sx={{ color: (theme) => theme.palette.text.disabled }}
			/>
		);
	}

	const onUpload = () => {
		const formData = new FormData();
		formData.append("tenant_data", acceptedFiles[0]);

		submit(formData, { method: "POST", encType: "multipart/form-data" });
	};

	return (
		<ContentLayout title={t("Import organization")}>
			<Dropzone {...getRootProps({ isDragActive })}>
				<input {...getInputProps()} />
				<Stack justifyContent="center" height="100%">
					{isDragActive ? (
						<Typography alignSelf="center">
							{t("Drop the files here ...")}
						</Typography>
					) : (
						<Typography alignSelf="center">
							{t(
								"Drag and drop an organization export here, or click to select file",
							)}
						</Typography>
					)}
				</Stack>
			</Dropzone>
			<Stack direction="row" spacing={2} alignSelf="end">
				<Button component={Link} to=".." relative="path">
					<Typography>{t("Back")}</Typography>
				</Button>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={!fileSelected || isImporting}
					onClick={onUpload}
					startIcon={icon}
				>
					{buttonText}
				</Button>
			</Stack>
			{actionData && (
				<Alert severity="error" variant="filled">
					<Typography>{actionData}</Typography>
				</Alert>
			)}
		</ContentLayout>
	);
}
