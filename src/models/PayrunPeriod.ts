import { IdType } from "./IdType"

export type PayrunPeriodEntry = {
  id: IdType
  employeeId: IdType
  payrunJobId: IdType
  netWage: number | null
  previousNetWage: number | null
  grossWage: number | null
  previousGrossWage: number | null
  paidOut: number | null
  documents: Array<PayrunDocument> | null
}

export type PayrunPeriod = {
  id: IdType
  entries: Array<PayrunPeriodEntry>
  periodStart: Date
  periodStatus: "open" | "closed"
  documents: Array<PayrunDocument> | null
}

export type PayrunDocument = {
  id: IdType,
  name: string,
  contentType: string,
  attributes: Record<string, string>
}
