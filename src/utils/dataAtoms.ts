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
	getEmployeeCases,
	getCompanyCases,
	getPayrunPeriodControllingTasks,
	getClientRegulation,
} from "../api/FetchClient";
import { payrollIdAtom, orgIdAtom } from "./routeParamAtoms";
import { authUserAtom } from "../auth/getUser";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { useOidc } from "../auth/authConfig";
import { IdType } from "../models/IdType";
import { MissingData } from "../models/MissingData";
import { atomWithRefresh, atomWithStorage, createJSONStorage } from "jotai/utils";
import { ExpandedState } from "@tanstack/react-table";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { AvailableCase } from "../models/AvailableCase";
import { ControllingData } from "../payrun/types";

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

export const missingDataEmployeesAtom = atomWithRefresh<Promise<Array<MissingData>>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];

	var employeeMissingData = await getEmployeeMissingData({ orgId, payrollId });
	if (Array.isArray(employeeMissingData)) {
		return employeeMissingData;
	}
	return [];
})

export const missingDataCompanyAtom = atomWithRefresh<Promise<MissingData>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	let missingData: MissingData = {
		id: payrollId,
		cases: []
	};
	if (orgId === null || payrollId === null)
		return missingData;

	var companyMissingDataCases = await getCompanyMissingDataCases({ orgId, payrollId });
	if (Array.isArray(companyMissingDataCases)) {
		missingData.cases = companyMissingDataCases;
	}
	return missingData;
})

export const onboardingCompanyAtom = atomWithRefresh<Promise<Array<AvailableCase>>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];

	var companyOnboardingCases = await getCompanyCases({ orgId, payrollId }, "O");
	if (Array.isArray(companyOnboardingCases)) {
		return companyOnboardingCases;
	}
	return [];
})

export const clientRegulationAtom = atom(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];
	return await getClientRegulation({ orgId, payrollId });
});

export const companyMissingDataCountAtom = atom(async (get) => {
	const missingCompanyData = await get(missingDataCompanyAtom);
	const onboardingData = await get(onboardingCompanyAtom);
	return missingCompanyData.cases.length + onboardingData.length;
})

export const showOrgSelectionAtom = atom(async (get) => {
	const orgs = await get(orgsAtom);
	return orgs.length > 1;
});

export const missingEmployeeDataMapAtom = atom<Promise<Map<IdType, MissingData>>>(async (get) => {
	const missingData = await get(missingDataEmployeesAtom);
	const map = new Map();
	for (var data of missingData || []) {
		map.set(data.id, data);
	}
	return map;
});

export const ESSMissingDataAtom = atomWithRefresh<Promise<Array<MissingData>>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	const selfServiceEmployee = await get(selfServiceEmployeeAtom);
	if (orgId === null || payrollId === null || selfServiceEmployee === null) return [];

	return getEmployeeCases({ orgId, payrollId, employeeId: selfServiceEmployee.id }, "ECT")
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

export function useEmployeeMissingDataCount(objectId: IdType) {
	const employeeMissingDataMap = useAtomValue(missingEmployeeDataMapAtom);
	const missingData = employeeMissingDataMap.get(objectId);
	if (!missingData) return 0;
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

const jsonSessionStorage = createJSONStorage(() => sessionStorage) as SyncStorage<ExpandedState>;
export const documentRecentSettingAtom = atomWithStorage<boolean>("setting.document.recent", true, undefined, { getOnInit: true });
export const expandedControllingTasks = atomWithStorage<ExpandedState>("config.payrolldashboard.expanded", {}, jsonSessionStorage, { getOnInit: true });


export const payrollControllingDataAtom = atomWithRefresh<Promise<ControllingData>>(async (get) => {
	const orgId = get(orgIdAtom);
	const payrollId = get(payrollIdAtom);
	if (orgId === null || payrollId === null) return [];
	var controllingData = await getPayrunPeriodControllingTasks({ orgId, payrollId });
	return controllingData;
})

export const payrollControllingDataTotalCountAtom = atom(async (get) => {
	const controllingData = await get(payrollControllingDataAtom);
	return controllingData.employeeControllingCases.length + (controllingData.companyControllingCases.length > 0 ? 1 : 0);
})
