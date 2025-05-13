import { IdType } from "./IdType"

export type PayrunPeriodEntry = {
  id: IdType
  employeeId: IdType
  payrunJobId: IdType
  identifier: string
  lastName: string
  firstName: string
  leavingDate: Date | null
  isEmployed: boolean
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
  hasWage: boolean
  documents: Array<PayrunDocument> | null
  state: "OutOfDate" | "Generating" | "Current" | "Error"
}

export type PayrunPeriod = {
  id: IdType
  entries: Array<PayrunPeriodEntry>
  periodStart: Date
  periodStatus: "Open" | "Closed"
  processingStatus: "Complete" | "ReadyToGenerate" | "Processing"
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
