import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from './en';
import deTranslations from './de';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      "en": enTranslations,
      "de": deTranslations,
    },
    lng: "de",
    interpolation: {
      escapeValue: false, // no need, react handles xss
    },
  });