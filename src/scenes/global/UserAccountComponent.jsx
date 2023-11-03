import { Typography, Stack, ButtonGroup, Button, TextField, useTheme, Alert } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";
import { useAtom, useAtomValue } from "jotai";
import { localUserEmailAtom } from "../../auth/getUser";
import { userAtom } from "../../utils/dataAtoms";
import { useOidc } from "../../auth/authConfig";

const buttonSx = {
  flexGrow: 1, lineHeight: 1, py: 1
};
const settingsLink = import.meta.env.VITE_AUTHORITY_SETTINGS_URL;

function AuthenticatedUserAccountComponent() {
  const { t } = useTranslation();
  const auth = useAuth();
  const handleLogout = () => {
    if (auth.isAuthenticated) {
      auth.removeUser();
    }
  };

  return (
    <Stack spacing={2} sx={{p: 2}}>
      <UserInformation />
      <ButtonGroup variant="outlined">
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
    </Stack>
  );

}

function LocalUserAccountComponent() {
  const [storedUserEmail, setStoredUserEmail] = useAtom(localUserEmailAtom);
  const theme = useTheme();
  const updateUser = email => {
    setStoredUserEmail(email);
    window.location.reload();
  }
  const onKeyDown = event => {
    if (event.keyCode === 13) {
      updateUser(event.target.value);
    }
  }
  return (
    <Stack>
      <UserInformation sx={{p: 2}} />
      <Stack p={2} spacing={0.5} sx={{background: getDevBg(theme)}}>
        <Typography variant="body2">DEV</Typography>
        <TextField defaultValue={storedUserEmail} variant="standard" onBlur={event => updateUser(event.target.value)} onKeyDown={onKeyDown} />
      </Stack>
    </Stack>
  );
}


function UserInformation({ sx }) {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  if (user === null) {
    return <Alert severity="error" sx={sx}><Typography>{t("User not found!")}</Typography></Alert>
  }
  return (
    <Stack sx={sx}>
      <Typography gutterBottom>{user.firstName} {user.lastName}</Typography>
      <Typography variant="body2">{user.identifier}</Typography>
    </Stack>
  );
}

function getDevBg(theme) {
  const bgColor = theme.palette.background.default;
  const stripeColor = "rgba(255, 221, 0, 0.2)";
  return `repeating-linear-gradient(305deg, ${bgColor}, ${bgColor} 10px, ${stripeColor} 10px, ${stripeColor} 20px)`
}

export function UserAccountComponent(props) {
  if (useOidc) {
    return AuthenticatedUserAccountComponent(props);
  }
  return LocalUserAccountComponent(props);
}
