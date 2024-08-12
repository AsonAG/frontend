import { IdType } from "./IdType";

export type Payroll = {
  id: IdType;
  name: string;
  divisionId: IdType;
  userRelations: Array<string>;
}
