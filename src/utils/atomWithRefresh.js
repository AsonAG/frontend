import { atom } from "jotai";

export function atomWithRefresh(fn) {
	const refreshCounter = atom(0);

	return atom(
		(get) => {
			get(refreshCounter);
			return fn(get);
		},
		(_, set) => set(refreshCounter, (i) => i + 1),
	);
}
