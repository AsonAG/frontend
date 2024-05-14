export function getDateLocale(user) {
	if (!user || !user.culture) {
		return "en";
	}

	const [locale] = user.culture.split("-");
	return locale;
}
