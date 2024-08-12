import { IdType } from "./IdType";

export type Tenant = {
  id: IdType;
  identifier: string;
  userRelations: Array<string>;
}
