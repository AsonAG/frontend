import { IdType } from "./IdType"


export type WageType = {
  id: IdType
  wageTypeNumber: number
  name: string
  attributes: Record<string, string>
}
