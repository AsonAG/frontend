import { IdType } from "./IdType";
import { StatusEnum } from "./StatusEnum";

export type User = {
  id: IdType;
  status: StatusEnum;
  firstName: string;
  lastName: string;
  identifier: string;
  culture: string;
  language: string;
};

export type UserMembership = {
  id: IdType
  tenantId: IdType
  userId: IdType
  firstName: string
  lastName: string
  role: UserRole
}

export type UserMembershipInvitation = {
  id: IdType
  tenantId: IdType
  tenantIdentifier: string
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
  employeeId: IdType
} | {
  "$type": "PayrollManager",
  payrollIds: Array<IdType>
}

export type UserRoleName = UserRole["$type"];