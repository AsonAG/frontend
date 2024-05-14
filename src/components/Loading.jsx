import { CircularProgress } from "@mui/material";
import { Centered } from "./Centered";

export function Loading() {
	return (
		<Centered>
			<CircularProgress />
		</Centered>
	);
}
