import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Imports ->  */

export const name = 'CA Certificate';

export const type = 'CaCertificate';

export const prefix = 'crt';

export const canDuplicate = true;

export const canSync = false;

interface BaseCaCertificate {
  parentId: string;
  path: string | null;
  disabled: boolean;
  // For sync control
  isPrivate: boolean;
}

export type CaCertificate = BaseModel & BaseCaCertificate;
/**** ><> ↑ --------- Constants and types ->  */

export function init(): BaseCaCertificate {
  return {
    parentId: '',
    disabled: false,
    path: null,
    isPrivate: false,
  };
}
/**** ><> ↑ --------- Initialization functions ->  */

export const isCaCertificate = (model: Pick<BaseModel, 'type'>): model is CaCertificate => (
  model.type === type
);
/**** ><> ↑ --------- Type check function ->  */

export function migrate(doc: CaCertificate) {
  return doc;
}
/**** ><> ↑ --------- Migration function ->  */

export function create(patch: Partial<CaCertificate> = {}) {
  if (!patch.parentId) {
    throw new Error('New CaCertificate missing `parentId`: ' + JSON.stringify(patch));
  }

  return db.docCreate<CaCertificate>(type, patch);
}
/**** ><> ↑ --------- Data creation function ->  */

export function update(
  cert: CaCertificate,
  patch: Partial<CaCertificate> = {},
) {
  return db.docUpdate<CaCertificate>(cert, patch);
}
/**** ><> ↑ --------- Data update function ->  */

export function getById(id: string) {
  return db.get<CaCertificate>(type, id);
}

export function findByParentId(parentId: string) {
  return db.getWhere<CaCertificate>(type, { parentId });
}
/**** ><> ↑ --------- Data retrieval functions ->  */

export function removeWhere(parentId: string) {
  return db.removeWhere(type, { parentId });
}
/**** ><> ↑ --------- Data deletion function ->  */

export function all() {
  return db.all<CaCertificate>(type);
}
/**** ><> ↑ --------- Function to get all data ->  */
