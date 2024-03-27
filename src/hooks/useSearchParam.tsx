import { useCallback } from "react";
import { NavigateOptions, useSearchParams } from "react-router-dom";


export function useSearchParam(name: string, opts: NavigateOptions | undefined) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(name) || "";
  const setValue = (updatedValue: string) => setSearchParams(prev => {
    const searchParams = new URLSearchParams(prev);
    if (updatedValue) {
      searchParams.set(name, updatedValue);
    } else {
      searchParams.delete(name);
    }
    return searchParams;
  }, opts);
  // setValue is not stable, see https://github.com/remix-run/react-router/issues/9991
  const stableSetValue = useCallback(setValue, [opts?.replace]);
  return [value, stableSetValue];
}
