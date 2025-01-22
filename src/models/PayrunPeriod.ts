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
  paidGarnishment: number | null
  garnishment: number
  retro: number
  openPayout: number | null
  openWagePayout: number | null
  openGarnishmentPayout: number | null
  openWagePayoutPreviousPeriod: number
  openGarnishmentPayoutPreviousPeriod: number
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
