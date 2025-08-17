import React, { PropsWithChildren, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { browserRouter } from "./routes";
import { AuthProvider } from "react-oidc-context";
import { authConfig, useOidc } from "./auth/authConfig";
import SignIn from "./auth/SignIn";
import "./translations";
import { getDateLocale } from "./services/converters/DateLocaleExtractor";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { getLanguageCode } from "./services/converters/LanguageConverter";
import { useCreateTheme } from "./theme";
import { userAtom } from "./utils/dataAtoms";

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

function AppScaffold({children}: PropsWithChildren) {
	const theme = useCreateTheme();
	const user = useAtomValue(userAtom);
	const { i18n } = useTranslation();

	useEffect(() => {
		dayjs.locale(getDateLocale(user));
		const languageCode = getLanguageCode(user?.language);
		i18n.changeLanguage(languageCode);
	}, [user?.culture, user?.language]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getDateLocale(user)}>
				{children}
			</LocalizationProvider>
		</ThemeProvider>

	)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
