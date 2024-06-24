import { User } from "oidc-client-ts";
import { authConfig, useOidc } from "./authConfig";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";


function getAuthUserAtom() {
	if (useOidc) {
		const storageKey = `oidc.user:${authConfig.authority}:${authConfig.client_id}`;
		const rawAuthUserAtom = atomWithStorage(storageKey, null, window.localStorage, { getOnInit: true });
		// return read only atom
		return atom(get => User.fromStorageString(get(rawAuthUserAtom)));
	}

	const defaultLocalUser = {
		profile: {
			email: "ajo@ason.ch",
			"urn:zitadel:iam:org:project:210239088282829057:roles": {
				user: {},
				hr: {},
				onboarding: {},
				admin: {},
				provider: {}
			}
		},
	};

	const localUserAtom = atomWithStorage("local.ason.user", defaultLocalUser, undefined, { getOnInit: true });
	return localUserAtom;
}

export const authUserAtom = getAuthUserAtom();

export const localUserEmailAtom = atom(
	(get) => get(authUserAtom)?.profile?.email,
	(get, set, update) => {
		const user = get(authUserAtom);
		user.profile.email = update;
		set(authUserAtom, user);
	}
);

export const authUserRolesAtom = atom((get) => {
	const authUser = get(authUserAtom);
	const rolesObject = authUser?.profile["urn:zitadel:iam:org:project:210239088282829057:roles"];
	if (rolesObject) {
		return Object.keys(rolesObject);
	}
	return [];
});
