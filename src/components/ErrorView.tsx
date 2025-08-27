import { Typography } from "@mui/material";
import { Centered } from "./Centered";
import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function ErrorView() {
	const { t } = useTranslation();
	const routeError = useRouteError();
	console.log("RouteError", routeError);
	return (
		<Centered>
			<Typography>{t("Something went wrong")}</Typography>
		</Centered>
	);
}
