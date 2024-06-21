import { Suspense, useState } from "react";
import {
	Box,
	IconButton,
	AppBar,
	Toolbar,
	Stack,
	Typography,
	FormControl,
	FormControlLabel,
	RadioGroup,
	Radio,
	Button,
	TextField,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDarkMode } from "../../theme";
import { Close, ImportExport } from "@mui/icons-material";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogTrigger,
} from "../../components/ResponsiveDialog";
import { useTranslation } from "react-i18next";
import { DatePicker } from "../../components/DatePicker";
import { useAtomValue } from "jotai";
import { tenantAtom } from "../../utils/dataAtoms";
import { requestExportDataDownload } from "../../api/FetchClient";
import { useRole } from "../../hooks/useRole";
import { Form } from "react-router-dom";

function Topbar({ children }) {
	const { isDarkMode, setDarkMode } = useDarkMode();

	return (
		<AppBar
			elevation={0}
			sx={{
				backgroundColor: "background.default",
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Toolbar
				disableGutters
				sx={{ mx: { sm: 2 }, gap: { xs: 1, sm: 2 } }}
				spacing={1}
			>
				{children}
				<Box sx={{ flexGrow: 1 }} />

				<Stack direction="row" spacing={0.5}>
					<Suspense>
						<ExportButton />
					</Suspense>
					<IconButton
						onClick={() => setDarkMode(isDarkMode ? "light" : "dark")}
						size="large"
					>
						{isDarkMode ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
					</IconButton>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

function ExportButton() {
	const { t } = useTranslation();
	const isProvider = useRole("provider");
	const tenant = useAtomValue(tenantAtom);
	if (!isProvider && import.meta.env.PROD) {
		return;
	}
	
	const dialog = tenant ? <ExportDialog tenant={tenant} /> : <ImportDialog />;

	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger>
				<IconButton onClick={() => { }} size="large">
					<ImportExport />
				</IconButton>
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<Stack direction="row" spacing={1}>
					<Typography variant="h6" flex={1}>
						{t("Tenant exportieren")}
					</Typography>
					<ResponsiveDialogClose>
						<IconButton>
							<Close />
						</IconButton>
					</ResponsiveDialogClose>
				</Stack>
				{dialog}
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

function ImportDialog() {
	const { t } = useTranslation();
	return (
		<Stack spacing={1}>
			<Form method="POST" action="tenants/import" encType="multipart/form-data">
				<TextField type="file" name="import_file" id="import_file" />
				<Button type="submit" variant="contained" color="primary">
					{t("Import")}
				</Button>
			</Form>
		</Stack>
	);
}

function ExportDialog({ tenant }) {
	const { t } = useTranslation();
	const downloadExport = async () => {
		const name = `${tenant.identifier}_export.zip`;
		await requestExportDataDownload({ tenantId: tenant.id }, name);
	};
	return (
		<Stack spacing={1}>
			<Typography>
			</Typography>
			<Button variant="contained" color="primary" onClick={downloadExport}>
				{t("Export")}
			</Button>
		</Stack>
	);
}

export default Topbar;
