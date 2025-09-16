import { useEffect, useState } from "react";

export function useHistoryCount(caseFieldName: string | undefined) {
	const [count, setCount] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(!!caseFieldName);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		if (!caseFieldName) {
			setCount(null);
			setLoading(false);
			setError(null);
			return;
		}

		const controller = new AbortController();

		const parseCountFromResponse = async (res: Response) => {
			const headerCount = res.headers.get("X-Total-Count");
			if (headerCount && !isNaN(Number(headerCount))) {
				return Number(headerCount);
			}

			try {
				const data = await res.json();
				if (typeof data?.total === "number") return data.total;
				if (typeof data?.count === "number") return data.count;
				if (Array.isArray(data?.items) && typeof data?.total === "number") {
					return data.total;
				}
				if (Array.isArray(data)) {
					return data.length;
				}
			} catch {}
			return null;
		};

		(async () => {
			setLoading(true);
			setError(null);
			try {
				const baseUrl = `history/${encodeURIComponent(caseFieldName)}`;

				// Versuch A: nur zählen (keine Items)
				let res = await fetch(`${baseUrl}?countOnly=1`, {
					signal: controller.signal,
				});
				if (res.ok) {
					const c = await parseCountFromResponse(res);
					if (typeof c === "number") {
						setCount(c);
						return;
					}
				}

				res = await fetch(`${baseUrl}?take=0`, {
					signal: controller.signal,
				});
				if (res.ok) {
					const c = await parseCountFromResponse(res);
					if (typeof c === "number") {
						setCount(c);
						return;
					}
				}

				res = await fetch(`${baseUrl}?take=2`, {
					signal: controller.signal,
				});
				if (res.ok) {
					const c = await parseCountFromResponse(res);

					if (typeof c === "number") {
						setCount(c);
						return;
					}
				}

				throw new Error("History count could not be determined");
			} catch (e) {
				if ((e as any)?.name !== "AbortError") {
					setError(e);
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => controller.abort();
	}, [caseFieldName]);

	return { count, loading, error };
}
