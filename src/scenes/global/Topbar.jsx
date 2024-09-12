import {
	Box,
	AppBar,
	Toolbar,
	Stack,
} from "@mui/material";
import { UserAccountComponent } from "./UserAccountComponent";
import { Suspense } from "react";
import { NewEventCommand } from "../../components/NewEventCommand";

function Topbar({ children }) {
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

				<Stack direction="row" spacing={2.5} alignItems="center">
					<NewEventCommand />
					<Suspense>
						<UserAccountComponent />
					</Suspense>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

export default Topbar;
