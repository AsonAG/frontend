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

export function useIsESS(): Boolean {
	const user = useAtomValue(userAtom);
	const authUserRoles = useAtomValue(authUserRolesAtom);
	const excludeRoles: Array<Role> = ["provider", "admin", "onboarding", "hr"];
	if (authUserRoles.some(role => excludeRoles.includes(role))) {
		return false;
	}

	if (user?.attributes?.roles && excludeRoles.some(role => user.attributes.roles.includes(role))) {
		return false;
	}

	return true;

}
