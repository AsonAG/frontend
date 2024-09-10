import { useCallback } from "react";
import { NavigateOptions, useSearchParams } from "react-router-dom";

interface SearchParamOptions {
	replace: boolean
	exclusive: boolean
}

export function useSearchParam(
	name: string,
	opts: SearchParamOptions | undefined,
) {
	const [searchParams, setSearchParams] = useSearchParams();
	const value = searchParams.get(name) || "";
	const setValue = (updatedValue: string) =>
		setSearchParams(() => {
			let searchParams = opts?.exclusive ? new URLSearchParams() : new URL(document.location.toString()).searchParams;
			if (updatedValue) {
				searchParams.set(name, updatedValue);
			} else {
				searchParams.delete(name);
			}
			return searchParams;
		}, opts);
	// setValue is not stable, see https://github.com/remix-run/react-router/issues/9991
	const stableSetValue = useCallback(setValue, [opts?.replace, opts?.exclusive]);
	return [value, stableSetValue];
}
