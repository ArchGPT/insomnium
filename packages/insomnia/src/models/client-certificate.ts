import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Module imports ->  */

export const name = 'Client Certificate';

export const type = 'ClientCertificate';

export const prefix = 'crt';

export const canDuplicate = true;

export const canSync = false;
/**** ><> ↑ --------- Module constants ->  */

interface BaseClientCertificate {
  parentId: string;
  host: string;
  passphrase: string | null;
  cert: string | null;
  key: string | null;
  pfx: string | null;
  disabled: boolean;
  // For sync control
  isPrivate: boolean;
}
/**** ><> ↑ --------- Interface definition ->  */

export type ClientCertificate = BaseModel & BaseClientCertificate;
/**** ><> ↑ --------- Type definition ->  */

export function init(): BaseClientCertificate {
  return {
    parentId: '',
    host: '',
    passphrase: null,
    disabled: false,
    cert: null,
    key: null,
    pfx: null,
    isPrivate: false,
  };
}
/**** ><> ↑ --------- Initialization function ->  */

export const isClientCertificate = (model: Pick<BaseModel, 'type'>): model is ClientCertificate => (
  model.type === type
);
/**** ><> ↑ --------- Type guard function ->  */

export function migrate(doc: ClientCertificate) {
  return doc;
}
/**** ><> ↑ --------- Migration function ->  */

export function create(patch: Partial<ClientCertificate> = {}) {
  if (!patch.parentId) {
    throw new Error('New ClientCertificate missing `parentId`: ' + JSON.stringify(patch));
  }

  return db.docCreate<ClientCertificate>(type, patch);
}
/**** ><> ↑ --------- Creation function ->  */

export function update(
  cert: ClientCertificate,
  patch: Partial<ClientCertificate> = {},
) {
  return db.docUpdate<ClientCertificate>(cert, patch);
}
/**** ><> ↑ --------- Update function ->  */

export function getById(id: string) {
  return db.get<ClientCertificate>(type, id);
}
/**** ><> ↑ --------- Get by id function ->  */

export function findByParentId(parentId: string) {
  return db.find<ClientCertificate>(type, { parentId });
}
/**** ><> ↑ --------- Find by parentId function ->  */

export function remove(cert: ClientCertificate) {
  return db.remove(cert);
}
/**** ><> ↑ --------- Removal function ->  */

export function all() {
  return db.all<ClientCertificate>(type);
}
/**** ><> ↑ --------- Get all items function ->  */
