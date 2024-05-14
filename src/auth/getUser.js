import { User } from "oidc-client-ts";
import { authConfig, useOidc } from "./authConfig";
import { atom, getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

const store = getDefaultStore();

export function getAuthUser() {
	if (useOidc) {
		return getOidcUser();
	}
	return store.get(localUserAtom);
}

function getOidcUser() {
	const storageKey = `oidc.user:${authConfig.authority}:${authConfig.client_id}`;
	const oidcStorage = localStorage.getItem(storageKey);
	try {
		return User.fromStorageString(oidcStorage);
	} catch {
		return initialValue;
	}
}

const defaultLocalUser = {
	profile: {
		email: "ajo@ason.ch",
	},
};

const localUserKey = "local.ason.user";

const storedLocalUser = localStorage.getItem(localUserKey);
const initialValue =
	storedLocalUser === null ? defaultLocalUser : JSON.parse(storedLocalUser);

const localUserAtom = atomWithStorage(localUserKey, initialValue);

export const localUserEmailAtom = atom(
	(get) => get(localUserAtom)?.profile?.email,
	(get, set, update) => set(localUserAtom, { profile: { email: update } }),
);
