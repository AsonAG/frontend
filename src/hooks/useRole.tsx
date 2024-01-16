import { useAtomValue } from "jotai";
import { userAtom } from "../utils/dataAtoms";

type Role = "admin" | "onboarding" | "hr" | "user";

export function useRole(role: Role): Boolean {
  const user = useAtomValue(userAtom);
  if (!user || !user.attributes.roles)
    return false;

  return user.attributes.roles.includes(role);
}
