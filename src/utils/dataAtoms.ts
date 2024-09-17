import {
	getPayrolls,
	getTasks,
	getOrganization,
	getUser,
	getEmployeeByIdentifier,
	getPayruns,
	getMissingData,
	getOrganizations,
} from "../api/FetchClient";
import { payrollIdAtom, orgIdAtom } from "./routeParamAtoms";
import { authUserAtom } from "../auth/getUser";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { useOidc } from "../auth/authConfig";
import { IdType } from "../models/IdType";
import { MissingData } from "../models/MissingData";
import { atomWithRefresh } from "jotai/utils";

export const orgsAtom = atomWithRefresh((get => {
	const _ = get(authUserAtom);
	return getOrganizations();
}));

export const orgAtom = atom((get) => {
	const orgId = get(orgIdAtom);
	if (orgId == null) return null;
	return getOrganization({ orgId });
});

export const payrollsAtom = atom((get) => {
	const orgId = get(orgIdAtom);
	if (orgId == null) return [];
	return getPayrolls({ orgId });
});

export const payrollAtom = atom(async (get) => {
	const payrolls = await get(payrollsAtom);
	const payrollId = get(payrollIdAtom);
	if (!Array.isArray(payrolls) || payrollId === null) {
		return null;
	}
	return payrolls.find((p) => p.id === payrollId);
});

export const userAtom = atom((get) => {
	const orgId = get(orgIdAtom);
	if (orgId == null) return null;
	const authUserEmail = get(authUserAtom)?.profile.email;
	return getUser({ orgId }, authUserEmail);
});

export const selfServiceEmployeeAtom = atom((get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return null;
	const authUserEmail = get(authUserAtom)?.profile.email;
	return getEmployeeByIdentifier({ orgId, payrollId }, authUserEmail);
});

export const payrunAtom = atom(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];
	const payruns = await getPayruns({ orgId, payrollId });
	return payruns[0] || null;
});

export const openTasksAtom = atomWithRefresh(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return { count: 0, items: [] };

	const user = await get(userAtom);
	let orderBy = "completed, scheduled, created";
	if (user !== null) {
		orderBy = `assignedUserId eq ${user.id}, ${orderBy}`;
	}
	const filter = "completed eq null";
	return getTasks({ orgId, payrollId }, filter, orderBy);
});

export const openMissingDataTasksAtom = atomWithRefresh<Promise<Array<MissingData>>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];

	var missingData = await getMissingData({ orgId, payrollId });
	if (!Array.isArray(missingData)) {
		return [];
	}
	return missingData;
});

export const showOrgSelectionAtom = atom(async (get) => {
	const orgs = await get(orgsAtom);
	return orgs.length > 1;
});

const missingDataMapAtom = atom<Promise<Map<IdType, MissingData>>>(async (get) => {
	const missingData = await get(openMissingDataTasksAtom);
	const map = new Map();
	for (var data of missingData || []) {
		map.set(data.id, data);
	}
	return map;
});

type ToastSeverity = 'error' | 'info' | 'success' | 'warning';

export type Toast = {
	severity: ToastSeverity,
	message: string
};

export const toastNotificationAtom = atom<Toast | null>(null);

export function toast(severity: ToastSeverity, message: string) {
	getDefaultStore().set(toastNotificationAtom, { severity, message });
}

export function useMissingDataCount(employeeId: IdType) {
	const allMissingData = useAtomValue(missingDataMapAtom);
	const employeeMissingData = allMissingData.get(employeeId);
	if (!employeeMissingData) return null;
	return employeeMissingData.cases.length;
}

export const userInformationAtom = atom((async get => {
	if (useOidc) {
		const authUser = get(authUserAtom);
		if (!authUser) return null;
		return {
			email: authUser.profile.email,
			name: authUser.profile.name
		};
	}
	const user = await get(userAtom);
	if (user) {
		return {
			email: user.identifier,
			name: `${user.firstName} ${user.lastName}`
		};
	}
	return null;
}));
