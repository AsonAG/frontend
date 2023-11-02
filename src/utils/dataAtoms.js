import { atomWithRefresh } from "./atomWithRefresh";
import { getPayrolls, getTasks, getTenant, getUser } from "../api/FetchClient";
import { payrollIdAtom, tenantIdAtom } from "./routeParamAtoms";
import getAuthUser from '../auth/getUser';
import { atom } from "jotai";

export const tenantAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  console.log("deriving tenant atom", tenantId);
  if (tenantId == null) return null;
  return getTenant({tenantId});
})

export const payrollsAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  if (tenantId == null) return [];
  return getPayrolls({tenantId});
})

export const userAtom = atom(get => {
  const tenantId = get(tenantIdAtom);
  if (tenantId == null) return null;
  const authUserEmail = getAuthUser()?.profile.email;
  return getUser({tenantId}, authUserEmail);
});

export const openTasksAtom = atomWithRefresh(get => {
  const tenantId = get(tenantIdAtom);
  const payrollId = get(payrollIdAtom);
  if (tenantId === null || payrollId === null)
    return {count: 0, items: []};
  
  const user = get(userAtom);
  let orderBy = "completed, scheduled, created";
  if (user !== null) {
    orderBy = `assignedUserId eq ${user.id}, ${orderBy}`;
  }
  const filter = "completed eq null";
  return getTasks({tenantId, payrollId}, filter, orderBy);
});

export const showTaskCompletedAlertAtom = atom(false);