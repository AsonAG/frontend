import { useEffect, useState } from "react";
import { getDefaultStore } from "jotai";
import { UIFeature } from "./UIFeature";
import { orgAtom, userMembershipAtom } from "./dataAtoms";

type PermissionMode = "None" | "Restricted" | "Full";

async function getPermissionMode(): Promise<PermissionMode | null> {
	const org = await getDefaultStore().get(orgAtom);
	return (org as any)?.attributes?.PermissionMode ?? null;
}

async function isAdmin(): Promise<boolean> {
	const membership = await getDefaultStore().get(userMembershipAtom);
	return membership?.role.$type === "Admin";
}

// Returns true (enabled), false (disabled), or null (still evaluating).
export function useUIFeatureRuntimeEnabled(feature: UIFeature): boolean | null {
	const [enabled, setEnabled] = useState<boolean | null>(null);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			if (feature === UIFeature.Tasks) {
				if (await isAdmin()) {
					if (!cancelled) setEnabled(true);
					return;
				}

				const mode = await getPermissionMode();

				if (!cancelled) {
					setEnabled(!!mode && mode !== "None" && mode !== "Restricted");
				}
			} else {
				if (!cancelled) setEnabled(true);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [feature]);

	return enabled;
}
