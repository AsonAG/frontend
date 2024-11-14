import {
	getPayrolls,
	getTasks,
	getOrganization,
	getUser,
	getEmployeeByIdentifier,
	getPayrun,
	getEmployeeMissingData,
	getOrganizations,
	getCompanyMissingDataCases,
} from "../api/FetchClient";
import { payrollIdAtom, orgIdAtom } from "./routeParamAtoms";
import { authUserAtom } from "../auth/getUser";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { useOidc } from "../auth/authConfig";
import { IdType } from "../models/IdType";
import { MissingData } from "../models/MissingData";
import { atomWithRefresh, atomWithStorage } from "jotai/utils";

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
	if (orgId === null || payrollId === null) return null;
	return await getPayrun({ orgId, payrollId });
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

export const missingDataTasksAtom = atomWithRefresh<Promise<Array<MissingData>>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];

	let missingData: Array<MissingData> = [];
	var employeeMissingData = await getEmployeeMissingData({ orgId, payrollId });
	var companyMissingDataCases = await getCompanyMissingDataCases({ orgId, payrollId });
	if (Array.isArray(employeeMissingData)) {
		missingData = employeeMissingData;
	}
	if (Array.isArray(companyMissingDataCases)) {
		const companyMissingData: MissingData = {
			id: payrollId,
			cases: companyMissingDataCases
		};
		missingData.push(companyMissingData);
	}
	return missingData;
});

export const showOrgSelectionAtom = atom(async (get) => {
	const orgs = await get(orgsAtom);
	return orgs.length > 1;
});

export const missingDataMapAtom = atom<Promise<Map<IdType, MissingData>>>(async (get) => {
	const missingData = await get(missingDataTasksAtom);
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

export function useMissingDataCount(objectId: IdType) {
	const allMissingData = useAtomValue(missingDataMapAtom);
	const missingData = allMissingData.get(objectId);
	if (!missingData) return null;
	return missingData.cases.length;
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

export const payrollDashboardFeatureAtom = atomWithStorage<boolean>("feature.payrolldashboard", false, undefined, { getOnInit: true });
export const documentRecentSettingAtom = atomWithStorage<boolean>("setting.document.recent", true, undefined, { getOnInit: true });

export const missingDataAppearanceAtom = atom(get => {
	const useDashboard = get(payrollDashboardFeatureAtom);
	if (useDashboard) {
		return {
			label: "Missing data",
			icon: 0
		};
	}
	return {
		label: "Controlling",
		icon: 1
	};
})
