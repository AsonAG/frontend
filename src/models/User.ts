import { IdType } from "./IdType";
import { StatusEnum } from "./StatusEnum";

export type User = {
  id: IdType;
  status: StatusEnum;
  firstName: string;
  lastName: string;
  identifier: string;
  email: string;
  culture: string;
  language: string;
  role: string;
};

export type UserRole = {
  "$type": string
  DivisionIds?: Array<IdType>
  EmployeeId?: IdType
}
