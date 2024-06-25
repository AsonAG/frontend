import {
	Box,
	IconButton,
	AppBar,
	Toolbar,
	Stack,
} from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDarkMode } from "../../theme";

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

export default Topbar;
