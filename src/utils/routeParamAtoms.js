import { atom } from 'jotai';
import { browserRouter } from '../routes';

const paramsAtom = atom({});
paramsAtom.onMount = (set) => {
  const callback = (state) => {
    console.log(state);
    if (Array.isArray(state.matches)) {
      const match = [...state.matches].pop();
      set(match.params);
    } else {
      set({});
    }
  };
  const unsubscribe = browserRouter.subscribe(callback);
  callback(browserRouter.state);
  return unsubscribe;
}

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