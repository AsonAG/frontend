import {
	Box,
	AppBar,
	Toolbar,
	Stack,
} from "@mui/material";
import { UserAccountComponent } from "./UserAccountComponent";
import { Suspense } from "react";

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

				<Stack direction="row" spacing={0.5}>
					<Suspense>
						<UserAccountComponent />
					</Suspense>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

export default Topbar;
