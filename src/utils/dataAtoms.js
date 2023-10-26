import { atom } from "jotai";
import { atomWithRefresh } from "./atomWithRefresh";
import { getTasks } from "../api/FetchClient";


export const tenantAtom = atom({id: 35});
export const payrollAtom = atom({id: 61});
export const userAtom = atom({id: 446});


export const openTasksAtom = atomWithRefresh((get) => {
  const tenant = get(tenantAtom);
  const payroll = get(payrollAtom);
  const user = get(userAtom);
  const params = {tenantId: tenant.id, payrollId: payroll.id};
  const filter = "completed eq null";
  const orderBy = `assignedUserId eq ${user.id}, completed, scheduled, created`;
  return getTasks(params, filter, orderBy);
})