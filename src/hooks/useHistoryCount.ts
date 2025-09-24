import { useEffect } from "react";
import { useFetcher } from "react-router-dom";

export function useHistoryCount(caseFieldName?: string) {
	if (!caseFieldName) {
		return { count: 0, loading: false, error: null as unknown, hasMore: false };
	}

	const fetcher = useFetcher();
	const encodedName = encodeURIComponent(caseFieldName);
	const loadUrl = `history/${encodedName}?top=1`;

	useEffect(() => {
		fetcher.load(loadUrl);
	}, [loadUrl]);

	const loading = fetcher.state === "loading";

	let safeCount = 0;
	if (fetcher.data) {
		const { count, items } = fetcher.data as {
			count?: number;
			items?: Array<unknown>;
		};
		if (typeof count === "number" && !isNaN(count)) {
			safeCount = count;
		} else if (Array.isArray(items)) {
			safeCount = items.length;
		}
	}

	const hasMore = safeCount > 1;

	return { count: safeCount, loading, error: null as unknown, hasMore };
}
