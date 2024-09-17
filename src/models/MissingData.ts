import { IdType } from "./IdType"

export type MissingData = {
  id: IdType,
  firstName?: string,
  lastName?: string,
  identifier?: string,
  cases: Array<MissingDataCase>
};

export type MissingDataCase = {
  id: IdType,
  name: string,
  displayName: string,
  clusters: Array<string>
};
