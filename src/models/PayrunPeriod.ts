import { IdType } from "./IdType"

export type PayrunPeriodEntry = {
  id: IdType
  employeeId: IdType
  payrunJobId: IdType
  netWage: number | null
  grossWage: number | null
  offsetting: number | null
  employerCost: number | null
  paidOut: number | null
  open: number | null
  documents: Array<PayrunDocument> | null
}

export type PayrunPeriod = {
  id: IdType
  entries: Array<PayrunPeriodEntry>
  periodStart: Date
  periodStatus: "Open" | "Closed"
  documents: Array<PayrunDocument> | null
}

export type PayrunDocument = {
  id: IdType,
  name: string,
  contentType: string,
  attributes: Record<string, string> | Record<"reports", DocumentReportDefinition>
}
type DocumentReportDefinition = {
  Name: string
  Variants: Array<string>
}
