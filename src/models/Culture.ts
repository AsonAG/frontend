export const supportedCultures = [
	"de-CH",
	"de-DE",
	"de-AT",
	"en-US",
	"en-GB",
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

export function getSupportedCulture(culture?: string): string | null {
	if (!culture) return null;
	if (supportedCulturesSet.has(culture)) return culture;
	if (countryCultures.has(culture)) {
		return culture;
	}
	return null;
}
