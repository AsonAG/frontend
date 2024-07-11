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
