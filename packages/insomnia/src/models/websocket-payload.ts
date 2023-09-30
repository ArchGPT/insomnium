import { database } from '../common/database';
import type { BaseModel } from '.';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'WebSocket Payload';

export const type = 'WebSocketPayload';

export const prefix = 'ws-payload';

export const canDuplicate = true;

export const canSync = true;
/**** ><> ↑ --------- Exporting constants ->  */

export interface BaseWebSocketPayload {
  name: string;
  value: string;
  mode: string;
}

export type WebSocketPayload = BaseModel & BaseWebSocketPayload & { type: typeof type };
/**** ><> ↑ --------- Interface and Type definitions ->  */

export const isWebSocketPayload = (model: Pick<BaseModel, 'type'>): model is WebSocketPayload => (
  model.type === type
);

export const isWebSocketPayloadId = (id: string | null) => (
  id?.startsWith(`${prefix}_`)
);
/**** ><> ↑ --------- Type check functions ->  */

export const init = (): BaseWebSocketPayload => ({
  name: 'New Payload',
  value: '',
  mode: 'application/json',
});
/**** ><> ↑ --------- Initialize WebSocketPayload function ->  */

export const migrate = (doc: WebSocketPayload) => doc;
/**** ><> ↑ --------- Migrate WebSocketPayload function ->  */

export const create = (patch: Partial<WebSocketPayload> = {}) => {
  if (!patch.parentId) {
    throw new Error(`New WebSocketPayload missing \`parentId\`: ${JSON.stringify(patch)}`);
  }

  return database.docCreate<WebSocketPayload>(type, patch);
};
/**** ><> ↑ --------- Create WebSocketPayload function ->  */

export const remove = (obj: WebSocketPayload) => database.remove(obj);
/**** ><> ↑ --------- Remove WebSocketPayload function ->  */

export const update = (
  obj: WebSocketPayload,
  patch: Partial<WebSocketPayload> = {}
) => database.docUpdate(obj, patch);
/**** ><> ↑ --------- Update WebSocketPayload function ->  */

export async function duplicate(request: WebSocketPayload, patch: Partial<WebSocketPayload> = {}) {
  // Only set name and "(Copy)" if the patch does
  // not define it and the request itself has a name.
  // Otherwise leave it blank so the request URL can
  // fill it in automatically.
  if (!patch.name && request.name) {
    patch.name = `${request.name} (Copy)`;
  }

  return database.duplicate<WebSocketPayload>(request, {
    name,
    ...patch,
  });
}
/**** ><> ↑ --------- Duplicate WebSocketPayload function ->  */

export const getById = (_id: string) => database.getWhere<WebSocketPayload>(type, { _id });
/**** ><> ↑ --------- Get WebSocketPayload by ID function ->  */
export const getByParentId = (parentId: string) => database.getWhere<WebSocketPayload>(type, { parentId });
/**** ><> ↑ --------- Get WebSocketPayload by Parent ID function ->  */

export const all = () => database.all<WebSocketPayload>(type);
/**** ><> ↑ --------- Get all WebSocketPayload function ->  */
