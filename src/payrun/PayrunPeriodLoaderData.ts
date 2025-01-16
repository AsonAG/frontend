import { AvailableCase } from "../models/AvailableCase"
import { Employee } from "../models/Employee"
import { PayrunPeriod } from "../models/PayrunPeriod"
import { BankAccountDetails } from "./BankAccountDetails"

export type PayrunPeriodLoaderData = {
  employees: Array<Employee>
  payrunPeriod: PayrunPeriod
  previousPayrunPeriod: PayrunPeriod | undefined
  controllingTasks: Array<Array<AvailableCase>>
  caseValueCounts: Array<number>
  bankAccountDetails: BankAccountDetails
}
