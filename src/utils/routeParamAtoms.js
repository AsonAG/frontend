import { atom } from 'jotai';

export const paramsAtom = atom({tenantId: null, payrollId: null});

export const tenantIdAtom = atom (get => {
  const params = get(paramsAtom);
  if (!params.tenantId)
    return null;
  return Number(params.tenantId);
});

export const payrollIdAtom = atom(get => {
  const params = get(paramsAtom);
  if (!params.payrollId)
    return null;
  return Number(params.payrollId);
})

export function buildParams(get) {
  return {tenantId: get(tenantIdAtom), payrollId: get(payrollIdAtom)};
}