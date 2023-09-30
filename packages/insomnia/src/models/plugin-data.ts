import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export const name = 'PluginData';

export const type = 'PluginData';

export const prefix = 'plg';

export const canDuplicate = false;

export const canSync = false;

/**** ><> ↑ --------- Constant field declarations ->  */
interface BasePluginData {
  plugin: string;
  key: string;
  value: string;
}
/**** ><> ↑ --------- Interface declaration for BasePluginData ->  */

export type PluginData = BaseModel & BasePluginData;

export const isPluginData = (model: Pick<BaseModel, 'type'>): model is PluginData => (
  model.type === type
);
/**** ><> ↑ --------- Type declaration for PluginData and isPluginData function ->  */

export function init(): BasePluginData {
  return {
    plugin: '',
    key: '',
    value: '',
  };
}
/**** ><> ↑ --------- Initialization function for BasePluginData ->  */

export function migrate(doc: PluginData) {
  return doc;
}
/**** ><> ↑ --------- Migrate function ->  */

export function create(patch: Partial<PluginData> = {}) {
  return db.docCreate<PluginData>(type, patch);
}
/**** ><> ↑ --------- Creation function for PluginData ->  */

export async function update(doc: PluginData, patch: Partial<PluginData>) {
  return db.docUpdate(doc, patch);
}
/**** ><> ↑ --------- Update function for PluginData ->  */

export async function upsertByKey(plugin: string, key: string, value: string) {
  const doc = await getByKey(plugin, key);
  return doc
    ? update(doc, {
      value,
    })
    : create({
      plugin,
      key,
      value,
    });
}
/**** ><> ↑ --------- Upsert function by key ->  */

export async function removeByKey(plugin: string, key: string) {
  return db.removeWhere(type, { plugin, key });
}
/**** ><> ↑ --------- Remove by key function ->  */

export async function all(plugin: string) {
  return db.find<PluginData>(type, { plugin });
}
/**** ><> ↑ --------- All function for PluginData ->  */

export async function removeAll(plugin: string) {
  return db.removeWhere(type, { plugin });
}
/**** ><> ↑ --------- RemoveAll function for PluginData ->  */

export async function getByKey(plugin: string, key: string) {
  return db.getWhere<PluginData>(type, { plugin, key });
}
/**** ><> ↑ --------- Get by key function ->  */
