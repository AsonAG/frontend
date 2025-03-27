import { IdType } from "./IdType"


export type Collector = {
  id: IdType
  name: string
  displayName: string
  attributes: Record<string, string>
}

