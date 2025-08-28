import { WebStorageStateStore } from "oidc-client-ts";

export const useOidc = !!import.meta.env.VITE_ENABLE_OIDC;

export const authConfig = {
	client_id: import.meta.env.VITE_CLIENT_ID,
	response_type: "code",
	response_mode: "query",
	code_challenge_method: "S256",
	scope: import.meta.env.VITE_SCOPE ?? "openid profile email",

	authority: import.meta.env.VITE_AUTHORITY_URL,
	redirect_uri: import.meta.env.VITE_REDIRECT_URL,
	post_logout_redirect_uri: import.meta.env.VITE_REDIRECT_URL,
	extraQueryParams: {
		audience: import.meta.env.VITE_AUDIENCE,
	},

	automaticSilentRenew: true,
	revokeTokensOnSignout: true,

	userStore: new WebStorageStateStore({ store: window.localStorage }),
	loadUserInfo: true,

	onSigninCallback: async (user) => {
		location.href = user?.state?.location || "/";
	},
};
