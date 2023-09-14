import { Typography, Stack, ButtonGroup, Button } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";

const buttonSx = {
    flexGrow: 1, lineHeight: 1, py: 1
};
const settingsLink = import.meta.env.VITE_AUTHORITY_SETTINGS_URL;

function UserAccountComponent({ user, ...stackProps }) {
    if (!user)
        return null;

    const handleLogout = () => {
        // TODO AJO handle logout
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
                >
                    Logout
                </Button>
            </ButtonGroup>
        </Stack>
    );
}

export default UserAccountComponent;