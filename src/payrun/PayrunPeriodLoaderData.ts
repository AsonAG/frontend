import { PayrunPeriod } from "../models/PayrunPeriod"
import { BankAccountDetails } from "./BankAccountDetails"
import { ControllingData } from "./types"

export type PayrunPeriodLoaderData = {
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingData: ControllingData
  bankAccountDetails: BankAccountDetails
  salaryTypes: Array<string>
  salaryTypesSet: Array<string>
}
