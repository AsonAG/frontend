import { IdType } from "./IdType"


export type WageType = {
  id: IdType
  wageTypeNumber: number
  name: string
  displayName: string
  collectors: string[]
  collectorGroups: string[]
  attributes: Record<string, string>
}
