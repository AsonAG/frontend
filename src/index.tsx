import React, { PropsWithChildren, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes";
import { AuthProvider } from "react-oidc-context";
import { authConfig, useOidc } from "./auth/authConfig";
import SignIn from "./auth/SignIn";
import "./translations";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { getLanguageCode } from "./services/converters/LanguageConverter";
import { useCreateTheme } from "./theme";
import { userAtom, userCultureAtom } from "./utils/dataAtoms";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(utc);
dayjs.extend(localizedFormat);

// dynamically load these when we support more locales
import "dayjs/locale/de";
import "dayjs/locale/de-ch";
import "dayjs/locale/de-at";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";
import "dayjs/locale/fr";
import "dayjs/locale/fr-ch";
import "dayjs/locale/it";
import "dayjs/locale/it-ch";
import { defaultBrowserCulture } from "./models/Culture";

function Authentication({ children }) {
	if (!useOidc) {
		return children;
	}
	return (
		<AuthProvider {...authConfig}>
			<SignIn>{children}</SignIn>
		</AuthProvider>
	);
}

function getDayjsLocale(culture: string) {
	if (
		culture === "de-CH" ||
		culture === "de-AT" ||
		culture === "en-GB" ||
		culture === "fr-CH" ||
		culture === "it-CH"
	) {
		return culture.toLowerCase();
	}
	return culture.split("-")[0];
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Authentication>
			<AppScaffold>
				<RouterProvider
					router={browserRouter}
					future={{ v7_startTransition: true }}
				/>
			</AppScaffold>
		</Authentication>
	</React.StrictMode>,
);

function AppScaffold({ children }: PropsWithChildren) {
	const theme = useCreateTheme();
	const user = useAtomValue(userAtom);
	const userLocale = useAtomValue(userCultureAtom) ?? defaultBrowserCulture;
	const { i18n } = useTranslation();
	const dayjsLocale = getDayjsLocale(userLocale);

	useEffect(() => {
		dayjs.locale(dayjsLocale);
		const languageCode = getLanguageCode(user?.language);
		i18n.changeLanguage(languageCode);
	}, [dayjsLocale, user?.language]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale={dayjsLocale}
			>
				{children}
			</LocalizationProvider>
		</ThemeProvider>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
