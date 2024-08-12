type Role = "provider" | "admin" | "onboarding" | "hr" | "user";

export function useRole(role: Role): Boolean {
	return true;
}
