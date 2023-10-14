import { WebStorageStateStore } from "oidc-client-ts"

const authConfig = {
  client_id: "210272222781178113@ason",
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
    window.history.replaceState(
      {},
      window.document.title,
      user?.state?.location || window.location.pathname
    );
  }
};


export default authConfig;