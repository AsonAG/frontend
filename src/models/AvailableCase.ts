import { IdType } from "./IdType";
import { AvailableCaseField } from "./AvailableCaseField";

export type AvailableCase = {
  id: IdType
  name: string
  displayName: string
  nameSynonyms?: Array<string>
  description?: string
  caseFields: Array<AvailableCaseField>
  attributes: Record<string, any>
};
