import { IdType } from "./IdType"


export type CaseDocument = {
  id: IdType
  name: string
  content: string
}

export type CaseValue = {
  id: IdType
  documents: Array<CaseDocument>
}
