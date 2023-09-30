import { database as db } from '../common/database';
import { generateId } from '../common/misc';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Library imports ->  */

export const name = 'Proto Directory';

export const type = 'ProtoDirectory';

export const prefix = 'pd';

export const canDuplicate = true;

export const canSync = true;

interface BaseProtoDirectory {
  name: string;
}

export type ProtoDirectory = BaseModel & BaseProtoDirectory;

/**** ><> ↑ --------- Constants and types definitions ->  */
export const isProtoDirectory = (model: Pick<BaseModel, 'type'>): model is ProtoDirectory => (
  model.type === type
);

export function init(): BaseProtoDirectory {
  return {
    name: 'New Proto Directory',
  };
}
/**** ><> ↑ --------- init function ->  */

export function migrate(doc: ProtoDirectory) {
  return doc;
}
/**** ><> ↑ --------- migrate function ->  */

export function createId() {
  return generateId(prefix);
}
/**** ><> ↑ --------- createId function ->  */

export function create(patch: Partial<ProtoDirectory> = {}) {
  if (!patch.parentId) {
    throw new Error('New ProtoDirectory missing `parentId`');
  }

  return db.docCreate<ProtoDirectory>(type, patch);
}
/**** ><> ↑ --------- create function ->  */

export function getById(_id: string) {
  return db.getWhere<ProtoDirectory>(type, { _id });
}

export function getByParentId(parentId: string) {
  return db.getWhere<ProtoDirectory>(type, { parentId });
}

export function findByParentId(parentId: string) {
  return db.find<ProtoDirectory>(type, { parentId });
}
/**** ><> ↑ --------- Fetching document functions ->  */

export function remove(obj: ProtoDirectory) {
  return db.remove(obj);
}

export async function batchRemoveIds(ids: string[]) {
  const dirs = await db.find(type, {
    _id: {
      $in: ids,
    },
  });
  await db.batchModifyDocs({
    upsert: [],
    remove: dirs,
  });
}
/**** ><> ↑ --------- delete operations ->  */

export function all() {
  return db.all<ProtoDirectory>(type);
}
/**** ><> ↑ --------- all function ->  */
