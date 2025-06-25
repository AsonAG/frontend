import { IdType } from "./IdType";

export type Payroll = {
  id: IdType
  name: string
  divisionId: IdType
  accountingStartDate: Date
  transmissionStartDate: Date
  language: string
}
