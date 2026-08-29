import { getDefaultStore } from "jotai";
import { authUserAtom } from "./getUser";

let auth;
let silentSignin;
let signinRedirect;

export function setAuthClient(authClient) {
	auth = authClient;
}

export async function silentlyReauthenticate() {
	if (!auth) {
		throw new Error("OIDC client is not available");
	}

	if (!silentSignin) {
		silentSignin = auth
			.signinSilent()
			.then((user) => {
				getDefaultStore().set(authUserAtom, user);
				return user;
			})
			.finally(() => {
				silentSignin = null;
			});
	}

	return silentSignin;
}

export function redirectToSignin() {
	if (!auth) {
		return Promise.resolve();
	}

	if (!signinRedirect) {
		const state = {
			location:
				window.location.pathname +
				window.location.search +
				window.location.hash,
		};
		signinRedirect = auth.signinRedirect({ state }).catch((error) => {
			signinRedirect = null;
			throw error;
		});
	}

	return signinRedirect;
}
