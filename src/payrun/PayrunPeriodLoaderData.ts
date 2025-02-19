import { AvailableCase } from "../models/AvailableCase"
import { IdType } from "../models/IdType"
import { PayrunPeriod } from "../models/PayrunPeriod"
import { BankAccountDetails } from "./BankAccountDetails"

export type PayrunPeriodLoaderData = {
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingTasks: Map<IdType, Array<AvailableCase>>
  caseValueCounts: Array<number>
  bankAccountDetails: BankAccountDetails
  salaryTypes: Array<string>
  salaryTypesSet: Array<string>
}
