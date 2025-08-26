import { IdType } from "./IdType";
import { Language } from "./Language";
import { StatusEnum } from "./StatusEnum";

export type User = {
  id: IdType;
  status: StatusEnum;
  firstName: string;
  lastName: string;
  identifier: string;
  culture: string;
  language: Language | null;
};

export type UserMembership = {
  id: IdType
  tenantId: IdType
  userId: IdType
  employeeId: IdType | null
  firstName: string
  lastName: string
  role: UserRole
}

export type UserMembershipInvitation = {
  id: IdType
  tenantId: IdType
  tenantIdentifier: string
  employeeId: IdType | null
  email: string
  role: UserRole
  expiresAt: string
}

export type UserRole = {
  "$type": "Admin"
} | {
  "$type": "Owner"
} | {
  "$type": "SelfService",
} | {
  "$type": "PayrollManager",
  payrollIds: Array<IdType>
}

export type UserRoleName = UserRole["$type"];