import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

type PaginatedData<T> = {
	items: Array<T>;
	count: number;
	loading: boolean;
	loadMore: () => void;
	hasMore: boolean;
};

export function useIncrementallyLoadedData<T>(
	url: string,
	step: number,
): PaginatedData<T> {
	const fetcher = useFetcher();
	const [top, setTop] = useState(step);
	const loadUrl = `${url}?top=${top}`;

	useEffect(() => {
		fetcher.load(loadUrl);
	}, [loadUrl]);

	if (!fetcher.data) {
		return {
			loading: true,
			items: [],
			count: 0,
			loadMore: () => {},
			hasMore: false,
		};
	}

	const items = fetcher.data.items;
	const count = fetcher.data.count;
	const loading = fetcher.state === "loading";
	const hasMore = items.length < count;

	function loadMore() {
		if (!loading && hasMore) setTop((top) => top + step);
	}

	return { items, count, loading, hasMore, loadMore };
}
