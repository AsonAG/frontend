import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseValueCount } from "../api/FetchClient";

type HookState = {
	count: number;
	loading: boolean;
	error: unknown;
};

export function useHistoryCount(caseFieldName?: string): HookState {
	const params = useParams();
	const [state, setState] = useState<HookState>({
		count: 0,
		loading: false,
		error: null,
	});

	useEffect(() => {
		if (!caseFieldName) {
			setState({ count: 0, loading: false, error: null });
			return;
		}

		let cancelled = false;
		setState((s) => ({ ...s, loading: true, error: null }));

		getCaseValueCount(params as any, undefined)
			.then((valueCounts: Record<string, number> | undefined) => {
				if (cancelled) return;
				const count = valueCounts?.[caseFieldName] ?? 0;
				setState({ count, loading: false, error: null });
			})
			.catch((err) => {
				if (cancelled) return;
				setState({ count: 0, loading: false, error: err });
			});

		return () => {
			cancelled = true;
		};
	}, [caseFieldName, params.orgId, params.payrollId, params.employeeId]);

	return state;
}
