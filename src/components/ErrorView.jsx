import { Typography } from "@mui/material";
import { Centered } from "./Centered";
import { useRouteError } from "react-router-dom";

export function ErrorView() {
	const error = useRouteError();
	console.log("RouteError", error);
	return (
		<Centered>
			<Typography>Ooops something went wrong</Typography>
		</Centered>
	);
}
