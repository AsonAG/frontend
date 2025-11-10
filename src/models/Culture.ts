export const supportedCultures = [
	"de-CH",
	"de-DE",
	"de-AT",
	"en-US",
	"en-UK",
	"fr-CH",
	"fr-FR",
	"it-CH",
	"it-IT",
] as const;

export type Culture = (typeof supportedCultures)[number];

const countryCultures = new Set(supportedCultures.map((x) => x.split("-")[0]));
const supportedCulturesSet = new Set<string>(supportedCultures);
export const defaultBrowserCulture =
	navigator.languages.find((lang) => supportedCulturesSet.has(lang)) ??
	navigator.languages.find((lang) => countryCultures.has(lang)) ??
	"de-CH";
