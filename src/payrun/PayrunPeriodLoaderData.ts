import { AvailableCase } from "../models/AvailableCase"
import { PayrunPeriod } from "../models/PayrunPeriod"
import { BankAccountDetails } from "./BankAccountDetails"

export type PayrunPeriodLoaderData = {
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingTasks: Array<Array<AvailableCase>>
  caseValueCounts: Array<number>
  bankAccountDetails: BankAccountDetails
}
