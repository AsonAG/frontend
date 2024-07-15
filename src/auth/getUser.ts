import { User } from "oidc-client-ts";
import { authConfig, useOidc } from "./authConfig";
import { Atom, WritableAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";


const authRoleProperty = `urn:zitadel:iam:org:project:${import.meta.env.VITE_PROJECT_ID}:roles`;

function getAuthUserAtom(): Atom<User | null> {
	if (useOidc) {
		const storageKey = `oidc.user:${authConfig.authority}:${authConfig.client_id}`;
		const rawAuthUserAtom = atomWithStorage<string | null>(storageKey, null, window.localStorage as SyncStorage<string | null>, { getOnInit: true });
		// return read only atom
		return atom(get => {
			const user = get(rawAuthUserAtom);
			if (!user) {
				return null;
			}
			return User.fromStorageString(user);
		});
	}

	const defaultLocalUser: User = {
		session_state: null,
		access_token: "",
		token_type: "Bearer",
		profile: {
			email: "ajo@ason.ch",
			[authRoleProperty]: {
				user: {},
				hr: {},
				onboarding: {},
				admin: {},
				provider: {}
			},
			sub: "",
			iss: "",
			aud: "",
			exp: 0,
			iat: 0
		},
		state: undefined,
		expires_in: undefined,
		expired: undefined,
		scopes: [],
		toStorageString: function(): string {
			throw new Error("Function not implemented.");
		}
	};

	const localUserAtom = atomWithStorage("local.ason.user", defaultLocalUser, undefined, { getOnInit: true });
	return localUserAtom;
}

export const authUserAtom = getAuthUserAtom();

function isWritable<T>(atom: Atom<T>): atom is WritableAtom<T, [T], unknown> {
	return "write" in atom;
}

export const localUserEmailAtom = atom(
	(get) => get(authUserAtom)?.profile?.email,
	(get, set, update: string) => {
		const user = get(authUserAtom);
		if (isWritable(authUserAtom) && user) {
			user.profile.email = update;
			set(authUserAtom, user);
		}
	}
);

export const authUserRolesAtom = atom((get) => {
	const authUser = get(authUserAtom);
	const rolesObject = authUser?.profile[authRoleProperty];
	if (rolesObject) {
		return Object.keys(rolesObject);
	}
	return [];
});
