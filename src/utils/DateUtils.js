import dayjs from "dayjs";

export function formatDate(date, includeTime) {
  if (!date) return null;
  const formatString = includeTime ? "L LT" : "L";
  return dayjs.utc(date).format(formatString);
}