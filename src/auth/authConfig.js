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
  
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  loadUserInfo: true,


  onSignIn: async (user) => {
    window.history.replaceState(
      {},
      window.document.title,
      window.location.pathname
    );
  },
  
  onSignOut: async (user) => {
  },
};


export default authConfig;