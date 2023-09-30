import path from 'path';

import type { BaseDriver } from './drivers/base';

// Can't really make this any more specific unfortunately
type JSONValue = any;

export type HookFn = (extension: string, value: Buffer) => Promise<Buffer>;

/**** ><> ↑ --------- Imports and type definitions ->  */
export interface Hook {
  read: HookFn;
  write: HookFn;
}

export default class Store {
  _driver: BaseDriver;
  _hooks: Hook[];

  constructor(driver: BaseDriver, hooks?: Hook[]) {
    this._driver = driver;
    this._hooks = hooks || [];
  }
/**** ><> ↑ --------- Store class definition, properties and constructor ->  */

  async hasItem(key: string) {
    return this._driver.hasItem(key);
  }
/**** ><> ↑ --------- hasItem method ->  */

  async setItem(key: string, value: JSONValue | Buffer) {
    const ext = path.extname(key);
    let serializedValue;

    try {
      serializedValue = await this._serialize(ext, value);
    } catch (err) {
      throw new Error(`Failed to serialize key=${key} err=${err}`);
    }

    return this._driver.setItem(key, serializedValue);
  }
/**** ><> ↑ --------- setItem method ->  */

  async setItemRaw(key: string, value: Buffer) {
    return this._driver.setItem(key, value);
  }
/**** ><> ↑ --------- setItemRaw method ->  */

  async getItem(key: string): Promise<JSONValue | null> {
    const rawValue = await this.getItemRaw(key);

    if (rawValue === null) {
      return null;
    }

    const ext = path.extname(key);
    let value;

    try {
      // Without the `await` here, the catch won't get called
      value = await this._deserialize(ext, rawValue);
    } catch (err) {
      console.log('Failed to deserialize', rawValue.toString('base64'));
      throw new Error(`Failed to deserialize key=${key} err=${err}`);
    }

    return value;
  }
/**** ><> ↑ --------- getItem method ->  */

  async getItemRaw(key: string): Promise<Buffer | null> {
    return this._driver.getItem(key);
  }
/**** ><> ↑ --------- getItemRaw method ->  */

  async removeItem(key: string) {
    return this._driver.removeItem(key);
  }
/**** ><> ↑ --------- removeItem method ->  */

  async keys(prefix: string, recursive = true) {
    return this._driver.keys(prefix, recursive);
  }
/**** ><> ↑ --------- keys method ->  */

  async clear() {
    return this._driver.clear();
  }
/**** ><> ↑ --------- clear method ->  */

  async _serialize(ext: string, raw: JSONValue | Buffer) {
    let buff = raw instanceof Buffer ? raw : Buffer.from(JSON.stringify(raw, null, 2), 'utf8');

    for (const hook of this._hooks) {
      if (!hook.write) {
        continue;
      }

      buff = await hook.write(ext, buff);
    }

    return buff;
  }
/**** ><> ↑ --------- _serialize method ->  */

  async _deserialize(ext: string, value: Buffer): Promise<JSONValue | null> {
    for (const hook of this._hooks) {
      if (!hook.read) {
        continue;
      }

      value = await hook.read(ext, value);
    }

    return JSON.parse(value.toString('utf8'));
  }
}
/**** ><> ↑ --------- _deserialize method ->  */
