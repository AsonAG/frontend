import { IdType } from "./IdType"

export type PayrunPeriodEntry = {
  employeeId: IdType
  payrunJobId: IdType
  netWage: number | null
  previousNetWage: number | null
  grossWage: number | null
  previousGrossWage: number | null
  paidOut: number | null
}

export type PayrunPeriod = {
  id: IdType
  entries: Array<PayrunPeriodEntry>
  periodStart: Date
  periodStatus: "open" | "closed"
}
