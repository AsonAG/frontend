import { atom } from "jotai";

export const paramsAtom = atom({ orgId: null, payrollId: null });

export const orgIdAtom = atom((get) => {
	const params = get(paramsAtom);
	if (!params.orgId) return null;
	return params.orgId;
});

export const payrollIdAtom = atom((get) => {
	const params = get(paramsAtom);
	if (!params.payrollId) return null;
	return params.payrollId;
});
