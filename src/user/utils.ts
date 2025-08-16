import { useAtomValue } from "jotai";
import { IdType } from "../models/IdType";
import { UserRole, UserRoleName } from "../models/User";
import { userMembershipAtom } from "../utils/dataAtoms";
import { authUserRolesAtom } from "../auth/getUser";


export function useRole(role: UserRoleName | "InstanceAdmin"): Boolean {
    const userMembership = useAtomValue(userMembershipAtom);
    const authUserRoles = useAtomValue(authUserRolesAtom);
    if (role === "InstanceAdmin" && authUserRoles.includes("provider"))
        return true;
    return userMembership?.role.$type === role;
}

export function isPayrollAdmin(role: UserRole, payrollId: IdType) {
    switch (role.$type) {
        case "Admin":
            return true;
        case "Owner":
            return true;
        case "PayrollManager":
            return role.payrollIds.includes(payrollId);
        case "SelfService":
            return false;
    }
}