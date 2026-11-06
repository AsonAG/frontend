import { useEffect, useRef } from "react";
import { useParams, useRevalidator } from "react-router-dom";
import { getOpenPayrunPeriod } from "../api/FetchClient";
import { PayrunPeriod } from "../models/PayrunPeriod";

const POLL_INTERVAL_MS = 5000;
// An entry without case values stays "OutOfDate" forever, so polling has to give up eventually.
const MAX_UNCHANGED_POLLING_MS = 10 * 60 * 1000;

// "Error" is deliberately not pending and processingStatus is not used:
// the backend reports "Processing" as long as any entry is in the "Error" state.
function hasPendingEntries(payrunPeriod: PayrunPeriod) {
	return payrunPeriod.entries.some(
		(entry) => entry.state === "OutOfDate" || entry.state === "Generating",
	);
}

function getEntryStateSignature(payrunPeriod: PayrunPeriod) {
	return payrunPeriod.entries
		.map((entry) => `${entry.id}:${entry.state}`)
		.sort()
		.join();
}

/**
 * Reloads the payrun period route once the state of an entry has changed,
 * for as long as entries are still being calculated.
 * Polls only the period itself, because the route loader sends one request per employee.
 */
export function usePayrunPeriodPolling(payrunPeriod: PayrunPeriod) {
	const params = useParams();
	const revalidator = useRevalidator();
	const revalidatorRef = useRef(revalidator);
	revalidatorRef.current = revalidator;

	const isActive =
		payrunPeriod.periodStatus === "Open" && hasPendingEntries(payrunPeriod);
	const signature = getEntryStateSignature(payrunPeriod);

	useEffect(() => {
		if (!isActive) return;

		let startedAt = Date.now();
		let timer: ReturnType<typeof setTimeout>;
		let cancelled = false;
		let isPolling = false;

		async function poll() {
			clearTimeout(timer);
			// a hidden tab stops polling until onVisibilityChange resumes it
			if (isPolling || document.hidden) return;
			isPolling = true;
			if (revalidatorRef.current.state === "idle") {
				const latest: PayrunPeriod | null = await getOpenPayrunPeriod(
					params,
				).catch(() => null);
				if (cancelled) return;
				if (latest && getEntryStateSignature(latest) !== signature) {
					// skipped by shouldRevalidate while a dialog is open, the next poll retries
					revalidatorRef.current.revalidate();
				}
			}
			isPolling = false;
			if (Date.now() - startedAt < MAX_UNCHANGED_POLLING_MS) {
				timer = setTimeout(poll, POLL_INTERVAL_MS);
			}
		}

		function onVisibilityChange() {
			if (document.hidden) return;
			startedAt = Date.now();
			poll();
		}

		document.addEventListener("visibilitychange", onVisibilityChange);
		timer = setTimeout(poll, POLL_INTERVAL_MS);
		return () => {
			cancelled = true;
			clearTimeout(timer);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [isActive, signature, params.orgId, params.payrollId]);
}
