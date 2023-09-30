import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Imports ->  */

export const name = 'Proto File';

export const type = 'ProtoFile';

export const prefix = 'pf';

export const canDuplicate = true;

export const canSync = true;

/**** ><> ↑ --------- Export constants ->  */
interface BaseProtoFile {
  name: string;
  protoText: string;
}

export type ProtoFile = BaseModel & BaseProtoFile;

/**** ><> ↑ --------- Interface and type declaration ->  */
export const isProtoFile = (model: Pick<BaseModel, 'type'>): model is ProtoFile => (
  model.type === type
);
/**** ><> ↑ --------- isProtoFile function ->  */

export function init(): BaseProtoFile {
  return {
    name: 'New Proto File',
    protoText: '',
  };
}
/**** ><> ↑ --------- init function ->  */

export function migrate(doc: ProtoFile) {
  return doc;
}
/**** ><> ↑ --------- migrate function ->  */

export function create(patch: Partial<ProtoFile> = {}) {
  if (!patch.parentId) {
    throw new Error('New ProtoFile missing `parentId`');
  }

  return db.docCreate<ProtoFile>(type, patch);
}
/**** ><> ↑ --------- create function ->  */

export function remove(protoFile: ProtoFile) {
  return db.remove(protoFile);
}
/**** ><> ↑ --------- remove function ->  */

export async function batchRemoveIds(ids: string[]) {
  const files = await db.find(type, {
    _id: {
      $in: ids,
    },
  });
  await db.batchModifyDocs({
    upsert: [],
    remove: files,
  });
}
/**** ><> ↑ --------- batchRemoveIds function ->  */

export function update(protoFile: ProtoFile, patch: Partial<ProtoFile> = {}) {
  return db.docUpdate<ProtoFile>(protoFile, patch);
}
/**** ><> ↑ --------- update function ->  */

export function getById(_id: string) {
  return db.getWhere<ProtoFile>(type, { _id });
}
/**** ><> ↑ --------- getById function ->  */

export function getByParentId(parentId: string) {
  return db.getWhere<ProtoFile>(type, { parentId });
}
/**** ><> ↑ --------- getByParentId function ->  */

export function findByParentId(parentId: string) {
  return db.find<ProtoFile>(type, { parentId });
}
/**** ><> ↑ --------- findByParentId function ->  */

export function all() {
  return db.all<ProtoFile>(type);
}
/**** ><> ↑ --------- all function ->  */
