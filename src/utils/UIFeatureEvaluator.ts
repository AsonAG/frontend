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

async function evaluateFeature(feature: UIFeature): Promise<boolean> {
	if (feature !== UIFeature.Tasks) {
		return true;
	}

	if (await isAdmin()) {
		return true;
	}

	const permissionMode = await getPermissionMode();

	if (!permissionMode || permissionMode === "None") {
		return false;
	}

	if (permissionMode === "Restricted") {
		return false;
	}

	return true;
}

export function useUIFeatureEvaluator(feature: UIFeature): boolean {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		let cancelled = false;

		evaluateFeature(feature).then((result) => {
			if (!cancelled) {
				setEnabled(result);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [feature]);

	return enabled;
}
