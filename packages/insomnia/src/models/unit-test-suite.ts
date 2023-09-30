import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'Unit Test Suite';

export const type = 'UnitTestSuite';

export const prefix = 'uts';

export const canDuplicate = true;

export const canSync = true;
/**** ><> ↑ --------- Constant declarations ->  */
export interface BaseUnitTestSuite {
  name: string;
}
/**** ><> ↑ --------- Interface declaration ->  */

export type UnitTestSuite = BaseModel & BaseUnitTestSuite;
/**** ><> ↑ --------- Type declaration ->  */

export const isUnitTestSuite = (model: Pick<BaseModel, 'type'>): model is UnitTestSuite => (
  model.type === type
);
/**** ><> ↑ --------- Function declarations ->  */

export function init() {
  return {
    name: 'My Test',
  };
}
/**** ><> ↑ --------- Initialization function ->  */

export function migrate(doc: UnitTestSuite) {
  return doc;
}
/**** ><> ↑ --------- Migration function ->  */

export function create(patch: Partial<UnitTestSuite> = {}) {
  if (!patch.parentId) {
    throw new Error('New UnitTestSuite missing `parentId` ' + JSON.stringify(patch));
  }

  return db.docCreate<UnitTestSuite>(type, patch);
}
/**** ><> ↑ --------- Create function ->  */

export function update(unitTestSuite: UnitTestSuite, patch: Partial<UnitTestSuite> = {}) {
  return db.docUpdate<UnitTestSuite>(unitTestSuite, patch);
}
/**** ><> ↑ --------- Update function ->  */

export function remove(unitTestSuite: UnitTestSuite) {
  return db.remove(unitTestSuite);
}
/**** ><> ↑ --------- Remove function ->  */

export function getByParentId(parentId: string) {
  return db.getWhere<UnitTestSuite>(type, { parentId });
}

export function findByParentId(parentId: string) {
  return db.find<UnitTestSuite>(type, { parentId });
}
/**** ><> ↑ --------- Get and find by parent id functions ->  */

export const getById = (_id: string) => db.getWhere<UnitTestSuite>(type, { _id });
/**** ><> ↑ --------- Get by id function ->  */

export function all() {
  return db.all<UnitTestSuite>(type);
}
/**** ><> ↑ --------- All function ->  */
