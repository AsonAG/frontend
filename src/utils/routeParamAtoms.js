import { atom } from "jotai";

export const paramsAtom = atom({ tenantId: null, payrollId: null });

export const tenantIdAtom = atom((get) => {
	const params = get(paramsAtom);
	if (!params.tenantId) return null;
	return params.tenantId;
});

export const payrollIdAtom = atom((get) => {
	const params = get(paramsAtom);
	if (!params.payrollId) return null;
	return params.payrollId;
});
