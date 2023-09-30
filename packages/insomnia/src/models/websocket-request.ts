import { database } from '../common/database';
import type { BaseModel } from '.';
import { RequestAuthentication, RequestHeader, RequestParameter } from './request';
/**** ><> ↑ --------- Import Statements ->  */

export const name = 'WebSocket Request';

export const type = 'WebSocketRequest';

export const prefix = 'ws-req';

export const canDuplicate = true;

export const canSync = true;

/**** ><> ↑ --------- Constants Definition ->  */
export interface BaseWebSocketRequest {
  name: string;
  description: string;
  url: string;
  metaSortKey: number;
  headers: RequestHeader[];
  authentication: RequestAuthentication;
  parameters: RequestParameter[];
  settingEncodeUrl: boolean;
  settingStoreCookies: boolean;
  settingSendCookies: boolean;
  settingFollowRedirects: 'global' | 'on' | 'off';
}
/**** ><> ↑ --------- BaseWebSocketRequest Interface Definition ->  */

export type WebSocketRequest = BaseModel & BaseWebSocketRequest & { type: typeof type };
/**** ><> ↑ --------- WebSocketRequest Type Definition ->  */

export const isWebSocketRequest = (model: Pick<BaseModel, 'type'>): model is WebSocketRequest => (
  model.type === type
);

export const isWebSocketRequestId = (id: string | null) => (
  id?.startsWith(`${prefix}_`)
);
/**** ><> ↑ --------- Type Guard Functions ->  */

export const init = (): BaseWebSocketRequest => ({
  name: 'New WebSocket Request',
  url: '',
  metaSortKey: -1 * Date.now(),
  headers: [],
  authentication: {},
  parameters: [],
  settingEncodeUrl: true,
  settingStoreCookies: true,
  settingSendCookies: true,
  settingFollowRedirects: 'global',
  description: '',
});
/**** ><> ↑ --------- Initialization Function ->  */

export const migrate = (doc: WebSocketRequest) => doc;
/**** ><> ↑ --------- Migrate Function ->  */

export const create = (patch: Partial<WebSocketRequest> = {}) => {
  if (!patch.parentId) {
    throw new Error(`New WebSocketRequest missing \`parentId\`: ${JSON.stringify(patch)}`);
  }

  return database.docCreate<WebSocketRequest>(type, patch);
};
/**** ><> ↑ --------- Create Function ->  */

export const remove = (obj: WebSocketRequest) => database.remove(obj);
/**** ><> ↑ --------- Remove Function ->  */

export const update = (
  obj: WebSocketRequest,
  patch: Partial<WebSocketRequest> = {}
) => database.docUpdate(obj, patch);
/**** ><> ↑ --------- Update Function ->  */

// This is duplicated (lol) from models/request.js
export async function duplicate(request: WebSocketRequest, patch: Partial<WebSocketRequest> = {}) {
  // Only set name and "(Copy)" if the patch does
  // not define it and the request itself has a name.
  // Otherwise leave it blank so the request URL can
  // fill it in automatically.
  if (!patch.name && request.name) {
    patch.name = `${request.name} (Copy)`;
  }

  // Get sort key of next request
  const q = {
    metaSortKey: {
      $gt: request.metaSortKey,
    },
  };
  // @ts-expect-error -- Database TSCONVERSION
  const [nextRequest] = await database.find<WebSocketRequest>(type, q, {
    metaSortKey: 1,
  });
  const nextSortKey = nextRequest ? nextRequest.metaSortKey : request.metaSortKey + 100;
  // Calculate new sort key
  const sortKeyIncrement = (nextSortKey - request.metaSortKey) / 2;
  const metaSortKey = request.metaSortKey + sortKeyIncrement;
  return database.duplicate<WebSocketRequest>(request, {
    name,
    metaSortKey,
    ...patch,
  });
}
/**** ><> ↑ --------- Duplicate Function ->  */

export const getById = (_id: string) => database.getWhere<WebSocketRequest>(type, { _id });
/**** ><> ↑ --------- GetBy Function ->  */

export const findByParentId = (parentId: string) => database.find<WebSocketRequest>(type, { parentId });
/**** ><> ↑ --------- Find Function ->  */

export const all = () => database.all<WebSocketRequest>(type);
/**** ><> ↑ --------- Get All Function ->  */
