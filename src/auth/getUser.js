import { User } from "oidc-client-ts"
import authConfig from "./authConfig";

// TODO AJO FIX INITIAL LOGIN
const getAuthUser = () => {
  const oidcStorage = localStorage.getItem(`oidc.user:${authConfig.authority}:${authConfig.client_id}`)
  if(!oidcStorage) {
    return null;
  }

  return User.fromStorageString(oidcStorage);
}

export default getAuthUser;