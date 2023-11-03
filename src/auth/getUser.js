import { User } from "oidc-client-ts"
import { authConfig, useOidc } from "./authConfig";
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const storageKey = `oidc.user:${authConfig.authority}:${authConfig.client_id}`;
const getItem = (key, initialValue) => {
    const oidcStorage = localStorage.getItem(key)
    try {
      return User.fromStorageString(oidcStorage);
    } catch {
      return initialValue;
    }
};
const authenticatedUserAtom = atomWithStorage(storageKey, getItem(storageKey, null), {
  getItem,
  setItem(key, value) {
    throw new Error("setting authenticated user via atom is not supported");
  },
  removeItem(key) {
    throw new Error("removing authenticated user via atom is not supported");
  }
})

const defaultLocalUser = {
  profile: {
    email: "ajo@ason.ch"
  }
};

const localUserKey = "local.ason.user";

const storedLocalUser = localStorage.getItem(localUserKey);
const initialValue = storedLocalUser === null ? defaultLocalUser : JSON.parse(storedLocalUser);

const localUserAtom = atomWithStorage(localUserKey, initialValue);

export const authUserAtom = useOidc ? authenticatedUserAtom: localUserAtom;

export const authUserEmailAtom = atom(
  (get) => get(authUserAtom)?.profile?.email,
  (get, set, update) => set(authUserAtom, {profile: {email: update}})
)
