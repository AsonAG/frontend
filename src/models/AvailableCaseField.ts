import { IdType } from "./IdType";


export type AvailableCaseField = {
  id: IdType;
  name: string;
  displayName: string;
  description?: string;
};
