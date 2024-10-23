import type { RecordId } from "surrealdb"

export interface User {
  id: RecordId<'User'>
  username?: string
  hash?: string
  salt?: string
  [x: string]: unknown
}