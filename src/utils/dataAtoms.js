import { atomWithRefresh } from "./atomWithRefresh";
import { getPayrolls, getTasks, getTenant, getUser, getEmployeeByIdentifier, getPayruns } from "../api/FetchClient";
import { payrollIdAtom, tenantIdAtom } from "./routeParamAtoms";
import { getAuthUser } from '../auth/getUser';
import { atom, getDefaultStore } from "jotai";

export const tenantAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  if (tenantId == null) return null;
  return getTenant({tenantId});
})

export const payrollsAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  if (tenantId == null) return [];
  return getPayrolls({tenantId});
})

export const payrollAtom = atom(async get => {
  const payrolls = await get(payrollsAtom);
  const payrollId = get(payrollIdAtom);
  if (!Array.isArray(payrolls) || payrollId === null) {
    return null;
  }
  return payrolls.find(p => p.id === payrollId);
})

export const userAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  if (tenantId == null) return null;
  const authUserEmail = getAuthUser()?.profile.email;
  return getUser({tenantId}, authUserEmail);
});

export const employeeAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  const payrollId = get(payrollIdAtom);
  if (tenantId === null || payrollId === null) return null;
  const authUserEmail = getAuthUser()?.profile.email;
  return getEmployeeByIdentifier({tenantId, payrollId}, authUserEmail);
});

export const payrunAtom = atom(async get => {
  const tenantId = get(tenantIdAtom);
  const payrollId = get(payrollIdAtom);
  if (tenantId === null || payrollId === null) return [];
  const payruns = await getPayruns({tenantId, payrollId});
  return payruns[0] || null;
});

export const openTasksAtom = atomWithRefresh(async get => {
  const tenantId = get(tenantIdAtom);
  const payrollId = get(payrollIdAtom);
  if (tenantId === null || payrollId === null)
    return {count: 0, items: []};
  
  const user = await get(userAtom);
  let orderBy = "completed, scheduled, created";
  if (user !== null) {
    orderBy = `assignedUserId eq ${user.id}, ${orderBy}`;
  }
  const filter = "completed eq null";
  return getTasks({tenantId, payrollId}, filter, orderBy);
});

export const toastNotificationAtom = atom(null);

export function toast(severity, message) {
  getDefaultStore().set(toastNotificationAtom, {severity, message})
}