import { useIncrementallyLoadedData } from "./useIncrementallyLoadedData"; // Pfad ggf. anpassen

export function useHistoryCount(caseFieldName?: string) {
	if (!caseFieldName) {
		return { count: 0, loading: false, error: null as unknown };
	}

	const { items, count, loading, hasMore } = useIncrementallyLoadedData<any>(
		`history/${encodeURIComponent(caseFieldName)}`,
		2,
	);

	let safeCount = 0;
	if (typeof count === "number" && !isNaN(count)) {
		safeCount = count;
	} else if (Array.isArray(items)) {
		safeCount = items.length;
	}

	return { count: safeCount, loading, error: null as unknown, hasMore };
}
