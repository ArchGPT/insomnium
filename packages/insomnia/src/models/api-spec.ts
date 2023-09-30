import { database as db } from '../common/database';
import { strings } from '../common/strings';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'ApiSpec';

export const type = 'ApiSpec';

export const prefix = 'spc';

export const canDuplicate = true;

export const canSync = true;
/**** ><> ↑ --------- Constant value definitions ->  */

export interface BaseApiSpec {
  fileName: string;
  contentType: 'json' | 'yaml';
  contents: string;
}

export type ApiSpec = BaseModel & BaseApiSpec;
/**** ><> ↑ --------- Type interfaces and definitions ->  */

export const isApiSpec = (model: Pick<BaseModel, 'type'>): model is ApiSpec => (
  model.type === type
);
/**** ><> ↑ --------- Type guard function ->  */

export function init(): BaseApiSpec {
  return {
    fileName: `New ${strings.document.singular}`,
    contents: '',
    contentType: 'yaml',
  };
}
/**** ><> ↑ --------- Initial value generator function ->  */

export function migrate(doc: ApiSpec) {
  return doc;
}
/**** ><> ↑ --------- Migration function ->  */

export function getByParentId(workspaceId: string) {
  return db.getWhere<ApiSpec>(type, { parentId: workspaceId });
}
/**** ><> ↑ --------- Database query functions ->  */

export async function getOrCreateForParentId(
  workspaceId: string,
  patch: Partial<ApiSpec> = {},
) {
  const spec = await db.getWhere<ApiSpec>(type, {
    parentId: workspaceId,
  });

  if (!spec) {
    return db.docCreate<ApiSpec>(type, { ...patch, parentId: workspaceId });
  }

  return spec;
}
/**** ><> ↑ --------- Async function to get or create a document for a parent ID ->  */

export async function updateOrCreateForParentId(
  workspaceId: string,
  patch: Partial<ApiSpec> = {},
) {
  const spec = await getOrCreateForParentId(workspaceId);
  return db.docUpdate(spec, patch);
}
/**** ><> ↑ --------- Async function to update or create a document for a parent ID ->  */

export async function all() {
  return db.all<ApiSpec>(type);
}
/**** ><> ↑ --------- Function to get all instances of a certain type ->  */

export function update(apiSpec: ApiSpec, patch: Partial<ApiSpec> = {}) {
  return db.docUpdate(apiSpec, patch);
}
/**** ><> ↑ --------- Function to update an api spec ->  */

export function removeWhere(parentId: string) {
  return db.removeWhere(type, { parentId });
}
/**** ><> ↑ --------- Function to remove items based on a parent ID ->  */
