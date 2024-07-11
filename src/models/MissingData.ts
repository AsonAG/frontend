import { IdType } from "./IdType"

export type MissingData = {
  id: IdType,
  firstName: string,
  lastName: string,
  identifier: string,
  cases: Array<EmployeeCase>
};

export type EmployeeCase = {
  id: IdType,
  name: string,
  displayName: string,
  clusters: Array<string>
};
