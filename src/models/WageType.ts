import { IdType } from "./IdType"


export type WageType = {
  id: IdType
  wageTypeNumber: number
  name: string
  displayName: string
  collectors: string[]
  attributes: Record<string, string>
}

export type WageTypeDetailed = {
  accountLookupValue: AccountLookupValue | null
  accountAssignmentRequired: boolean

} & WageType

export type AccountLookupValue = {
  id?: IdType
  key: string
  created?: string
  value: WageTypeAccounts
}
type WageTypeAccounts = {
  debitAccountNumber: string
  creditAccountNumber: string
}

