import { RegulationName } from "./PayrollRegulations"

export type AvailableRegulations = CountrySpecificRegulations[]

export type CountrySpecificRegulations = AvailableRegulation & {
  industries: AvailableRegulation[]
  erp: AvailableRegulation[]
  accountingDocument: AvailableRegulation[]
  accountingData: AvailableRegulation[]
}

export type AvailableRegulation = {
  name: RegulationName
  displayName: string
}
