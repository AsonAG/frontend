const authConfig = (setAuthUserIdentifier) => {
  return {
    clientId: "210272222781178113@ason",
    responseType: "code",
    response_mode: "query",
    code_challenge_method: "S256",
    scope: "openid profile email",

    authority: process.env.REACT_APP_AUTHORITY_URL,
    redirectUri: process.env.REACT_APP_REDIRECT_URL,
    post_logout_redirect_uri: process.env.REACT_APP_REDIRECT_URL,

    autoSignIn: true,
    autoSignOut: true,
    loadUserInfo: true,
    
    // stateStore: localStorage,

    onSignIn: async (response) => {
      console.log("LogoIN activated");
      localStorage.setItem("ason_access_token", response.access_token);
      setAuthUserIdentifier(response.profile.email);
      window.history.replaceState(
        {},
        window.document.title,
        window.location.origin + window.location.pathname
      );
      window.location = "";
      window.location.hash = "";
    },
    
    onSignOut: async (response) => {
      console.log("LogOUT activated");
      localStorage.removeItem("ason_access_token");
      setAuthUserIdentifier();
    },
  };
};

export default authConfig;
