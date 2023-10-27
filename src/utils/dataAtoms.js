import { atomWithRefresh } from "./atomWithRefresh";
import { getPayrolls, getTasks, getTenant, getUser } from "../api/FetchClient";
import { buildParams } from "./routeParamAtoms";
import getAuthUser from '../auth/getUser';

function atomWithTenant(derive, defaultValue = null) {
  return atomWithRefresh(get => {
    const params = buildParams(get);
    if (params.tenantId === null)
      return defaultValue;
    return derive({get, params});
  })
}

export const tenantAtom = atomWithTenant(params => getTenant(params));

export const payrollsAtom = atomWithTenant(params => getPayrolls(params), []);

export const userAtom = atomWithTenant(params => {
  const authUserEmail = getAuthUser()?.profile.email;
  return getUser(params, authUserEmail);
});

export const openTasksAtom = atomWithTenant(({ get, params }) => {
  const user = get(userAtom);
  let orderBy = "completed, scheduled, created";
  if (user !== null) {
    orderBy = `assignedUserId eq ${user.id}, ${orderBy}`;
  }
  const filter = "completed eq null";
  return getTasks(params, filter, orderBy);
}, {count: 0, items: []});
