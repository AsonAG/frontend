import { Stack } from "@mui/material";

export function Centered({ children }) {
	return (
		<Stack
			flex={1}
			justifyContent="center"
			alignItems="center"
			sx={{ height: "100%" }}
		>
			{children}
		</Stack>
	);
}
