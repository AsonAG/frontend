import { User } from "oidc-client-ts"
import authConfig from "./authConfig";

// TODO AJO FIX INITIAL LOGIN
function getAuthenticatedUser () {
  const oidcStorage = localStorage.getItem(`oidc.user:${authConfig.authority}:${authConfig.client_id}`)
  if(!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

function getFakeUser() {
  return {
    email: "ajo@ason.ch"
  }
}

const getUser = import.meta.env.PROD ? getAuthenticatedUser : getFakeUser;

export default getUser;