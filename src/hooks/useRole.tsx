import { useAtomValue } from "jotai";
import { userAtom } from "../utils/dataAtoms";
import { authUserRolesAtom } from "../auth/getUser";

type Role = "provider" | "admin" | "onboarding" | "hr" | "user";

export function useRole(role: Role): Boolean {
	const user = useAtomValue(userAtom);
	const authUserRoles = useAtomValue(authUserRolesAtom);
	if (authUserRoles.includes(role)) {
		return true;
	}

	if (user?.attributes?.roles?.includes(role)) {
		return true;
	}

	return false;
}
