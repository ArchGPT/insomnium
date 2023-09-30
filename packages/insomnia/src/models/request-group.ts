import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'Folder';

export const type = 'RequestGroup';

export const prefix = 'fld';

export const canDuplicate = true;

export const canSync = true;
/**** ><> ↑ --------- Constant declarations ->  */
interface BaseRequestGroup {
  name: string;
  description: string;
  environment: Record<string, any>;
  environmentPropertyOrder: Record<string, any> | null;
  metaSortKey: number;
}

export type RequestGroup = BaseModel & BaseRequestGroup;
/**** ><> ↑ --------- Type and interface definitions ->  */

export const isRequestGroup = (model: Pick<BaseModel, 'type'>): model is RequestGroup => (
  model.type === type
);
/**** ><> ↑ --------- Type assertion function ->  */

export function init(): BaseRequestGroup {
  return {
    name: 'New Folder',
    description: '',
    environment: {},
    environmentPropertyOrder: null,
    metaSortKey: -1 * Date.now(),
  };
}
/**** ><> ↑ --------- init function ->  */

export function migrate(doc: RequestGroup) {
  return doc;
}
/**** ><> ↑ --------- migrate function ->  */

export function create(patch: Partial<RequestGroup> = {}) {
  if (!patch.parentId) {
    throw new Error('New RequestGroup missing `parentId`: ' + JSON.stringify(patch));
  }

  return db.docCreate<RequestGroup>(type, patch);
}
/**** ><> ↑ --------- create function ->  */

export function update(requestGroup: RequestGroup, patch: Partial<RequestGroup> = {}) {
  return db.docUpdate<RequestGroup>(requestGroup, patch);
}
/**** ><> ↑ --------- update function ->  */

export function getById(id: string) {
  return db.get<RequestGroup>(type, id);
}
/**** ><> ↑ --------- getById function ->  */

export function findByParentId(parentId: string) {
  return db.find<RequestGroup>(type, { parentId });
}
/**** ><> ↑ --------- findByParentId function ->  */

export function remove(requestGroup: RequestGroup) {
  return db.remove(requestGroup);
}
/**** ><> ↑ --------- remove function ->  */

export function all() {
  return db.all<RequestGroup>(type);
}
/**** ><> ↑ --------- all function ->  */

export async function duplicate(requestGroup: RequestGroup, patch: Partial<RequestGroup> = {}) {
  if (!patch.name) {
    patch.name = `${requestGroup.name} (Copy)`;
  }

  // Get sort key of next request
  const q = {
    metaSortKey: {
      $gt: requestGroup.metaSortKey,
    },
  };

  // @ts-expect-error -- TSCONVERSION appears to be a genuine error
  const [nextRequestGroup] = await db.find<RequestGroup>(type, q, {
    metaSortKey: 1,
  });

  const nextSortKey = nextRequestGroup
    ? nextRequestGroup.metaSortKey
    : requestGroup.metaSortKey + 100;

  // Calculate new sort key
  const sortKeyIncrement = (nextSortKey - requestGroup.metaSortKey) / 2;
  const metaSortKey = requestGroup.metaSortKey + sortKeyIncrement;
  return db.duplicate<RequestGroup>(requestGroup, {
    metaSortKey,
    ...patch,
  });
}
/**** ><> ↑ --------- duplicate function ->  */

export const isRequestGroupId = (id: string) => id.startsWith(prefix);
/**** ><> ↑ --------- isRequestGroupId function ->  */
