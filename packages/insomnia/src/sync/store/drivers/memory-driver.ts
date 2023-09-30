import type { BaseDriver } from './base';
export default class MemoryDriver implements BaseDriver {
  // TODO: unsound definite property assignment assertion
  _db!: Record<string, Buffer>;
/**** ><> ↑ --------- Imports and class declaration ->  */

  constructor() {
    this._init();
  }
/**** ><> ↑ --------- Class constructor ->  */

  async hasItem(key: string) {
    return this._db[String(key)] instanceof Buffer;
  }
/**** ><> ↑ --------- hasItem Method ->  */

  async setItem(key: string, value: Buffer) {
    this._db[String(key)] = value;
  }
/**** ><> ↑ --------- setItem Method ->  */

  async getItem(key: string) {
    let value: Buffer | null = null;

    if (await this.hasItem(key)) {
      value = this._db[key];
    }

    return value;
  }
/**** ><> ↑ --------- getItem Method ->  */

  async removeItem(key: string) {
    delete this._db[String(key)];
  }
/**** ><> ↑ --------- removeItem Method ->  */

  async clear() {
    this._init();
  }
/**** ><> ↑ --------- clear Method ->  */

  async keys(prefix: string, recursive: boolean) {
    const keys: string[] = [];
    const baseLevels = prefix.split('/').length;

    for (const key of Object.keys(this._db)) {
      if (key.indexOf(prefix) !== 0) {
        continue;
      }

      const levels = key.split('/').length;
      const isInBaseLevel = levels === baseLevels + 1;

      if (!recursive && !isInBaseLevel) {
        continue;
      }

      keys.push(key);
    }

    return keys;
  }
/**** ><> ↑ --------- keys Method ->  */

  _init() {
    this._db = {};
  }
}
/**** ><> ↑ --------- _init Function ->  */
