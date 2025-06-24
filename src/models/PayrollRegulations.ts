
export type PayrollRegulations = {
  countryRegulationName: RegulationName | null
  industries: RegulationName[]
  erp: RegulationName[]
  accountingDocument: RegulationName | null
}
export type RegulationName = string;
