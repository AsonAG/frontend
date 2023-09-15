import { Typography, Stack, ButtonGroup, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";

const buttonSx = {
    flexGrow: 1, lineHeight: 1, py: 1
};
const settingsLink = import.meta.env.VITE_AUTHORITY_SETTINGS_URL;

function UserAccountComponent({ user, ...stackProps }) {
    const auth = useAuth();
    if (!user)
        return null;

    const handleLogout = () => {
        if (auth.isAuthenticated) {
            auth.removeUser();
        }
    };

    return (
        <Stack spacing={2} {...stackProps}>
            <Stack>
                <Typography gutterBottom>{user.firstName} {user.lastName}</Typography>
                <Typography variant="body2">{user.identifier}</Typography>
            </Stack>
            <ButtonGroup variant="outlined">
                <Button 
                    sx={buttonSx}
                    color="primary"
                    component={Link}
                    to={settingsLink}
                >
                    Settings
                </Button>
                <Button
                    sx={buttonSx}
                    color="primary"
                    endIcon={<LogoutIcon sx={{height: 16}} />}
                    onClick={handleLogout}
                    disabled={!auth.isAuthenticated}
                >
                    Logout
                </Button>
            </ButtonGroup>
        </Stack>
    );
}

export default UserAccountComponent;