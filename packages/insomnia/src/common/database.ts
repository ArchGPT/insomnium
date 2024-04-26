export type { Query, Operation, SpecificQuery, ModelQuery, ChangeType, ChangeBufferEvent } from "./database-provider"
import { database as fsDB } from "./database-provider/fs"
import { database as neDB } from "./database-provider/nedb"

export async function _fixDBShape() {}

export { fsDB as database }
