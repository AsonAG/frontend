import { WebStorageStateStore } from "oidc-client-ts";

export const useOidc = import.meta.env.PROD;

export const authConfig = {
	client_id: import.meta.env.VITE_CLIENT_ID,
	response_type: "code",
	response_mode: "query",
	code_challenge_method: "S256",
	scope: "openid profile email",

	authority: import.meta.env.VITE_AUTHORITY_URL,
	redirect_uri: import.meta.env.VITE_REDIRECT_URL,
	post_logout_redirect_uri: import.meta.env.VITE_REDIRECT_URL,

	automaticSilentRenew: true,
	revokeTokensOnSignout: true,

	userStore: new WebStorageStateStore({ store: window.localStorage }),
	loadUserInfo: true,

	onSigninCallback: async (user) => {
		location.href = user?.state?.location || "/";
	},
};
