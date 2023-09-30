import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'gRPC Request';
export const type = 'GrpcRequest';
export const prefix = 'greq';
export const canDuplicate = true;
export const canSync = true;
/**** ><> ↑ --------- Constants definitions ->  */

export interface GrpcRequestBody {
  text?: string;
}

export interface GrpcRequestHeader {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface BaseGrpcRequest {
  name: string;
  url: string;
  description: string;
  protoFileId?: string;
  protoMethodName?: string;
  body: GrpcRequestBody;
  metadata: GrpcRequestHeader[];
  metaSortKey: number;
  isPrivate: boolean;
}
/**** ><> ↑ --------- Interface definitions ->  */

export type GrpcRequest = BaseModel & BaseGrpcRequest;

export const isGrpcRequest = (model: Pick<BaseModel, 'type'>): model is GrpcRequest => (
  model.type === type
);

export const isGrpcRequestId = (id: string | null) => (
  id?.startsWith(`${prefix}_`)
);
/**** ><> ↑ --------- Type and Boolean function definitions ->  */

export function init(): BaseGrpcRequest {
  return {
    url: '',
    name: 'New gRPC Request',
    description: '',
    protoFileId: '',
    protoMethodName: '',
    metadata: [],
    body: {
      text: '{}',
    },
    metaSortKey: -1 * Date.now(),
    isPrivate: false,
  };
}
/**** ><> ↑ --------- Function to initialize a BaseGrpcRequest ->  */

export function migrate(doc: GrpcRequest) {
  return doc;
}
/**** ><> ↑ --------- Placeholder function for migration ->  */

export function create(patch: Partial<GrpcRequest> = {}) {
  if (!patch.parentId) {
    throw new Error('New GrpcRequest missing `parentId`');
  }

  return db.docCreate<GrpcRequest>(type, patch);
}

export function remove(obj: GrpcRequest) {
  return db.remove(obj);
}

export function update(obj: GrpcRequest, patch: Partial<GrpcRequest> = {}) {
  return db.docUpdate(obj, patch);
}

export function getById(_id: string) {
  return db.getWhere<GrpcRequest>(type, { _id });
}

export function findByProtoFileId(protoFileId: string) {
  return db.find<GrpcRequest>(type, { protoFileId });
}

export function findByParentId(parentId: string) {
  return db.find<GrpcRequest>(type, { parentId });
}
/**** ><> ↑ --------- Database operation functions ->  */

// This is duplicated (lol) from models/request.js
export async function duplicate(request: GrpcRequest, patch: Partial<GrpcRequest> = {}) {
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
  // @ts-expect-error -- TSCONVERSION
  const [nextRequest] = await db.find<GrpcRequest>(type, q, {
    metaSortKey: 1,
  });
  const nextSortKey = nextRequest ? nextRequest.metaSortKey : request.metaSortKey + 100;
  // Calculate new sort key
  const sortKeyIncrement = (nextSortKey - request.metaSortKey) / 2;
  const metaSortKey = request.metaSortKey + sortKeyIncrement;
  return db.duplicate<GrpcRequest>(request, {
    name,
    metaSortKey,
    ...patch,
  });
}
/**** ><> ↑ --------- Function to duplicate a gRPC request ->  */

export function all() {
  return db.all<GrpcRequest>(type);
}
/**** ><> ↑ --------- Function to retrieve all gRPC requests ->  */
