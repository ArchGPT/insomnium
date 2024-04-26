import { Database } from "./index"

export async function migrate(from: Database, to: Database, types: string[]): Promise<void> {
  const missing = []
  for (const type of types) {
    const [allFrom, allTo] = await Promise.all([from.all(type), to.all(type)])
    const toIds = allTo.map(item => item._id);
    missing.push(...allFrom.filter(item => !toIds.includes(item._id)))
  }
  await to.batchModifyDocs({
    upsert: missing,
  })
}
