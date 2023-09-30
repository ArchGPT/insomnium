import { database as db } from '../common/database';
import type { BaseModel } from './index';

export const name = 'Unit Test';

export const type = 'UnitTest';

export const prefix = 'ut';

export const canDuplicate = true;

export const canSync = true;
/**** ><> ↑ --------- Imports and constants ->  */
interface BaseUnitTest {
  name: string;
  code: string;
  requestId: string | null;
}

export type UnitTest = BaseModel & BaseUnitTest;
/**** ><> ↑ --------- Unit test model definition ->  */

export const isUnitTest = (model: Pick<BaseModel, 'type'>): model is UnitTest => (
  model.type === type
);
/**** ><> ↑ --------- Type guard for unit test model ->  */

export function init() {
  return {
    requestId: null,
    name: 'My Test',
    code: '',
  };
}
/**** ><> ↑ --------- Function to initialize a unit test ->  */

export function migrate(doc: UnitTest) {
  return doc;
}
/**** ><> ↑ --------- Function to migrate a unit test ->  */

export function create(patch: Partial<UnitTest> = {}) {
  if (!patch.parentId) {
    throw new Error('New UnitTest missing `parentId` ' + JSON.stringify(patch));
  }

  return db.docCreate<UnitTest>(type, patch);
}
/**** ><> ↑ --------- Function to create a unit test in the database ->  */

export function remove(unitTest: UnitTest) {
  return db.remove(unitTest);
}
/**** ><> ↑ --------- Function to remove a unit test from the database ->  */

export function update(unitTest: UnitTest, patch: Partial<UnitTest> = {}) {
  return db.docUpdate<UnitTest>(unitTest, patch);
}
/**** ><> ↑ --------- Function to update a unit test in the database ->  */

export function getByParentId(parentId: string) {
  return db.getWhere<UnitTest>(type, { parentId });
}
/**** ><> ↑ --------- Function to fetch a unit test from the database by parent id ->  */

export function all() {
  return db.all<UnitTest>(type);
}
/**** ><> ↑ --------- Function to fetch all unit tests from the database ->  */
