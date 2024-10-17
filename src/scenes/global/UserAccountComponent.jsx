import {
	Typography,
	Stack,
	ButtonGroup,
	Button,
	TextField,
	IconButton,
	FormGroup,
	FormControlLabel,
	Switch
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { useAtom, useAtomValue } from "jotai";
import { localUserEmailAtom } from "../../auth/getUser";
import { caseDocumentsFeatureAtom, payrollDashboardFeatureAtom, userInformationAtom } from "../../utils/dataAtoms";
import { useOidc } from "../../auth/authConfig";
import * as Popover from '@radix-ui/react-popover';
import { AccountCircle } from "@mui/icons-material";
import { useDarkMode } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ContrastIcon from '@mui/icons-material/Contrast';
import ErrorIcon from '@mui/icons-material/Error';

const buttonSx = {
	flexGrow: 1,
	lineHeight: 1,
	py: 1,
};
const settingsLink = import.meta.env.VITE_AUTHORITY_SETTINGS_URL;

function AuthenticatedUserSettings() {
	// this does not change at runtime
	if (!useOidc)
		return null;

	const { t } = useTranslation();
	const auth = useAuth();
	const handleLogout = () => {
		if (auth.isAuthenticated) {
			auth.removeUser();
		}
	};

	return (
		<ButtonGroup variant="outlined" fullWidth>
			<Button
				sx={buttonSx}
				color="primary"
				component={Link}
				to={settingsLink}
			>
				{t("Settings")}
			</Button>
			<Button
				sx={buttonSx}
				color="primary"
				endIcon={<LogoutIcon sx={{ height: 16 }} />}
				onClick={handleLogout}
			>
				Logout
			</Button>
		</ButtonGroup>
	);
}

function UserEdit() {
	const [storedUserEmail, setStoredUserEmail] = useAtom(localUserEmailAtom);
	const updateUser = (email) => {
		if (email !== storedUserEmail) {
			setStoredUserEmail(email);
			window.location.reload();
		}
	};
	const onKeyDown = (event) => {
		if (event.keyCode === 13) {
			updateUser(event.target.value);
		}
	};
	return (
		<TextField
			defaultValue={storedUserEmail}
			fullWidth
			variant="standard"
			onBlur={(event) => updateUser(event.target.value)}
			onKeyDown={onKeyDown}
			slotProps={{
				htmlInput: {
					style: { textAlign: "center" }
				}
			}}
		/>
	);
}

function UserInformation() {
	const { t } = useTranslation();
	const userInformation = useAtomValue(userInformationAtom) ?? {
		name: t("User does not exist!"),
		email: "<MISSING EMAIL>"
	};


	return (
		<Stack alignItems="center" width="100%">
			<Typography variant="h6" gutterBottom>{userInformation.name}</Typography>
			{
				useOidc ?
					<Typography variant="body2">{userInformation.email}</Typography> :
					<UserEdit />
			}
		</Stack>
	);
}

function FeatureFlags() {
	if (import.meta.env.PROD)
		return;

	const [dashboard, setDashboard] = useAtom(payrollDashboardFeatureAtom);
	const [caseDocuments, setCaseDocuments] = useAtom(caseDocumentsFeatureAtom);

	return (
		<Stack alignSelf="stretch">
			<Typography variant="h6">Features</Typography>
			<FormGroup>
				<FormControlLabel control={<Switch checked={dashboard} onChange={(_, checked) => setDashboard(checked)} />} label="Payroll Dashboard" />
				<FormControlLabel control={<Switch checked={caseDocuments} onChange={(_, checked) => setCaseDocuments(checked)} />} label="Dokumente via Cases" />
			</FormGroup>
		</Stack>
	)
}

const popoverSx = {
	border: 1,
	borderColor: "divider",
	bgcolor: theme => theme.palette.background.default,
	overflow: "hidden",
	zIndex: theme => theme.zIndex.appBar
};

export function UserAccountComponent() {
	const userInformation = useAtomValue(userInformationAtom);
	const icon = userInformation ? <AccountCircle /> : <ErrorIcon color="error" />

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<IconButton size="large">
					{icon}
				</IconButton>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content asChild>
					<Stack spacing={2} borderRadius={2} mx={2} p={2} sx={popoverSx} alignItems="center">
						<UserInformation />
						<AuthenticatedUserSettings />
						<ThemeModePicker />
						<FeatureFlags />
					</Stack>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

function ThemeModePicker() {
	const { t } = useTranslation();
	const { darkMode, setDarkMode } = useDarkMode();
	return (
		<ButtonGroup>
			<Button
				variant={darkMode === "light" ? "contained" : "outlined"}
				onClick={() => setDarkMode("light")}
				startIcon={<LightModeOutlinedIcon sx={{ height: 16 }} />}
				sx={buttonSx}
			>
				{t("Light")}
			</Button>
			<Button
				variant={darkMode === "system" ? "contained" : "outlined"}
				onClick={() => setDarkMode("system")}
				startIcon={<ContrastIcon sx={{ height: 16 }} />}
				sx={buttonSx}
			>
				{t("System")}
			</Button>
			<Button
				variant={darkMode === "dark" ? "contained" : "outlined"}
				onClick={() => setDarkMode("dark")}
				startIcon={<DarkModeOutlinedIcon sx={{ height: 16 }} />}
				sx={buttonSx}
			>
				{t("Dark")}
			</Button>
		</ButtonGroup>
	)
}
