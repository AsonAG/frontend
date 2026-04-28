import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./en";
import deTranslations from "./de";
import frTranslations from "./fr";
import itTranslations from "./it";

i18next.use(initReactI18next).init({
	resources: {
		en: enTranslations,
		de: deTranslations,
		fr: frTranslations,
		it: itTranslations,
	},
	lng: "de",
	interpolation: {
		escapeValue: false, // no need, react handles xss
	},
	lng: "fr",
	interpolation: {
		escapeValue: false, // no need, react handles xss
	},
	lng: "it",
	interpolation: {
		escapeValue: false, // no need, react handles xss
	},
});
