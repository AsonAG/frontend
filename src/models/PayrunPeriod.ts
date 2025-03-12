import { IdType } from "./IdType"

export type PayrunPeriodEntry = {
  id: IdType
  employeeId: IdType
  payrunJobId: IdType
  identifier: string
  lastName: string
  firstName: string
  netWage: number | null
  grossWage: number | null
  offsetting: number | null
  employerCost: number | null
  paidOut: number | null
  paidOutGarnishment: number | null
  garnishment: number
  retro: number
  openPayout: number | null
  openWagePayout: number | null
  openGarnishmentPayout: number | null
  openWagePayoutPreviousPeriod: number
  openGarnishmentPayoutPreviousPeriod: number
  documents: Array<PayrunDocument> | null
  processingStatus: "Complete" | "Processing"
}

export type PayrunPeriod = {
  id: IdType
  entries: Array<PayrunPeriodEntry>
  periodStart: Date
  periodStatus: "Open" | "Closed"
  documents: Array<PayrunDocument> | null
  processingStatus: "Complete" | "Processing"
}

export type PayrunDocument = {
  id: IdType,
  name: string,
  documentStatus: "Ready" | "Generating"
  contentType: string,
  attributes: Record<string, string> | Record<"reports", DocumentReportDefinition>
}
type DocumentReportDefinition = {
  Name: string
  Variants: Array<string>
}
