import * as crypto from 'crypto';

import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import Statements ->  */

export const name = 'Environment';
export const type = 'Environment';
export const prefix = 'env';
export const canDuplicate = true;
export const canSync = true;
/**** ><> ↑ --------- Constant Declarations ->  */

export interface BaseEnvironment {
  name: string;
  data: Record<string, any>;
  dataPropertyOrder: Record<string, any> | null;
  color: string | null;
  metaSortKey: number;
  // For sync control
  isPrivate: boolean;
}

export type Environment = BaseModel & BaseEnvironment;

/**** ><> ↑ --------- Interface & Type Declarations ->  */
export const isEnvironment = (model: Pick<BaseModel, 'type'>): model is Environment => (
  model.type === type
);

export function init() {
  return {
    name: 'New Environment',
    data: {},
    dataPropertyOrder: null,
    color: null,
    isPrivate: false,
    metaSortKey: Date.now(),
  };
}
/**** ><> ↑ --------- Initial Environment Configuration ->  */

export function migrate(doc: Environment) {
  return doc;
}
/**** ><> ↑ --------- Environment Migration ->  */

export function create(patch: Partial<Environment> = {}) {
  if (!patch.parentId) {
    throw new Error(`New Environment missing \`parentId\`: ${JSON.stringify(patch)}`);
  }

  return db.docCreate<Environment>(type, patch);
}
/**** ><> ↑ --------- Environment Creation ->  */

export function update(environment: Environment, patch: Partial<Environment>) {
  return db.docUpdate(environment, patch);
}
/**** ><> ↑ --------- Environment Update ->  */

export function findByParentId(parentId: string) {
  return db.find<Environment>(
    type,
    {
      parentId,
    },
    {
      metaSortKey: 1,
    },
  );
}
/**** ><> ↑ --------- Find Environment By ParentId ->  */

export async function getOrCreateForParentId(parentId: string) {
  const environments = await db.find<Environment>(type, {
    parentId,
  });

  if (!environments.length) {
    return create({
      parentId,
      name: 'Base Environment',
      // Deterministic base env ID. It helps reduce sync complexity since we won't have to
      // de-duplicate environments.
      _id: `${prefix}_${crypto.createHash('sha1').update(parentId).digest('hex')}`,
    });
  }

  return environments[environments.length - 1];
}
/**** ><> ↑ --------- Get or Create Environment for ParentId ->  */

export function getById(id: string): Promise<Environment | null> {
  return db.get(type, id);
}
/**** ><> ↑ --------- Get Environment By Id ->  */

export function getByParentId(parentId: string): Promise<Environment | null> {
  return db.getWhere<Environment>(type, { parentId });
}
/**** ><> ↑ --------- Get Environment By ParentId ->  */

export async function duplicate(environment: Environment) {
  const name = `${environment.name} (Copy)`;
  // Get sort key of next environment
  const q = {
    metaSortKey: {
      $gt: environment.metaSortKey,
    },
  };
  // @ts-expect-error -- TSCONVERSION appears to be a genuine error
  const [nextEnvironment] = await db.find<Environment>(type, q, { metaSortKey: 1 });
  const nextSortKey = nextEnvironment ? nextEnvironment.metaSortKey : environment.metaSortKey + 100;
  // Calculate new sort key
  const metaSortKey = (environment.metaSortKey + nextSortKey) / 2;
  return db.duplicate(environment, {
    name,
    metaSortKey,
  });
}
/**** ><> ↑ --------- Duplicate Environment ->  */

export function remove(environment: Environment) {
  return db.remove(environment);
}
/**** ><> ↑ --------- Remove Environment ->  */

export function all() {
  return db.all<Environment>(type);
}
/**** ><> ↑ --------- Get All Environments ->  */
