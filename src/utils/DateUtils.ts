import dayjs from "dayjs";

export function formatDate(date?: Date, includeTime?: boolean): string | undefined {
	if (!date) return undefined;
	const formatString = includeTime ? "L LT" : "L";
	return dayjs.utc(date).format(formatString);
}
