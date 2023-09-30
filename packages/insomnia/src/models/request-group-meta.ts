import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'Folder Meta';

export const type = 'RequestGroupMeta';

export const prefix = 'fldm';

export const canDuplicate = false;

export const canSync = false;
/**** ><> ↑ --------- Export constants ->  */

interface BaseRequestGroupMeta {
  collapsed: boolean;
}

export type RequestGroupMeta = BaseModel & BaseRequestGroupMeta;
/**** ><> ↑ --------- Interface and type definitions ->  */

export const isRequestGroupMeta = (model: Pick<BaseModel, 'type'>): model is RequestGroupMeta => (
  model.type === type
);
/**** ><> ↑ --------- Type guard function ->  */

export function init() {
  return {
    parentId: null,
    collapsed: false,
  };
}
/**** ><> ↑ --------- Model initialization function ->  */

export function migrate(doc: RequestGroupMeta) {
  return doc;
}
/**** ><> ↑ --------- Model migration function ->  */

export function create(patch: Partial<RequestGroupMeta> = {}) {
  if (!patch.parentId) {
    throw new Error('New RequestGroupMeta missing `parentId`: ' + JSON.stringify(patch));
  }

  return db.docCreate<RequestGroupMeta>(type, patch);
}
/**** ><> ↑ --------- Model creation function ->  */

export function update(requestGroupMeta: RequestGroupMeta, patch: Partial<RequestGroupMeta>) {
  return db.docUpdate<RequestGroupMeta>(requestGroupMeta, patch);
}
/**** ><> ↑ --------- Model update function ->  */

export function getByParentId(parentId: string) {
  return db.getWhere<RequestGroupMeta>(type, { parentId });
}
/**** ><> ↑ --------- Model retrieval by parent id ->  */

export function all() {
  return db.all<RequestGroupMeta>(type);
}
/**** ><> ↑ --------- Model retrieval function all ->  */
