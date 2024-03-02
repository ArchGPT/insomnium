import { BaseModel, mustGetModel } from "../../models/index";
import * as models from "../../models";
import { generateId } from "../misc";
import electron from "electron";

export interface Query {
  _id?: string | SpecificQuery;
  parentId?: string | SpecificQuery | null;
  remoteId?: string | null;
  plugin?: string;
  key?: string;
  environmentId?: string | null;
  protoFileId?: string;
}

export type Sort<T = unknown> = Record<keyof T | string, any>;

export interface Operation {
  upsert?: BaseModel[];
  remove?: BaseModel[];
}

export interface SpecificQuery {
  $gt?: number;
  $in?: string[];
  $nin?: string[];
}

export type ModelQuery<T extends BaseModel> = Partial<
  Record<keyof T, SpecificQuery>
>;
export type ChangeType = "insert" | "update" | "remove";

export interface Database {
  all<T extends BaseModel>(type: string): Promise<T[]>;

  batchModifyDocs(operation: Operation): Promise<void | undefined>;

  /** buffers database changes and returns a buffer id */
  bufferChanges(millis?: number): Promise<number>;

  /** buffers database changes and returns a buffer id */
  bufferChangesIndefinitely(): Promise<number>;

  count(type: string, query?: Query): Promise<number>;

  docCreate<T extends BaseModel>(
    type: string,
    ...patches: Patch<T>[]
  ): Promise<T>;

  docUpdate<T extends BaseModel>(
    originalDoc: T,
    ...patches: Patch<T>[]
  ): Promise<T>;

  duplicate<T extends BaseModel>(originalDoc: T, patch?: Patch<T>): Promise<T>;

  find<T extends BaseModel>(
    type: string,
    query?: Query,
    sort?: Sort<T>
  ): Promise<T[]>;

  findMostRecentlyModified<T extends BaseModel>(
    type: string,
    query?: Query,
    limit?: number | null
  ): Promise<T[]>;

  flushChanges(id?: number, fake?: boolean): Promise<void>;

  get<T extends BaseModel>(type: string, id?: string): Promise<T | null>;

  getMostRecentlyModified<T extends BaseModel>(
    type: string,
    query?: Query
  ): Promise<T | null>;

  getWhere<T extends BaseModel>(
    type: string,
    query: ModelQuery<T> | Query
  ): Promise<T | null>;

  init(
    types: string[],
    config: object,
    forceReset?: boolean,
    consoleLog?: typeof console.log
  ): Promise<void>;

  initClient(): Promise<void>;

  insert<T extends BaseModel>(
    doc: T,
    fromSync?: boolean,
    initializeModel?: boolean
  ): Promise<T>;

  onChange(callback: ChangeListener): void;

  offChange(callback: ChangeListener): void;

  remove<T extends BaseModel>(doc: T, fromSync?: boolean): Promise<void>;

  removeWhere(type: string, query: Query): Promise<void>;

  /** Removes entries without removing their children */
  unsafeRemove<T extends BaseModel>(doc: T, fromSync?: boolean): Promise<void>;

  update<T extends BaseModel>(doc: T, fromSync?: boolean): Promise<T>;

  upsert<T extends BaseModel>(doc: T, fromSync?: boolean): Promise<T>;

  withAncestors<T extends BaseModel>(
    doc: T | null,
    types?: string[]
  ): Promise<T[]>;

  withDescendants<T extends BaseModel>(
    doc: T | null,
    stopType?: string | null
  ): Promise<BaseModel[]>;
}

export type ChangeBufferEvent<T extends BaseModel = BaseModel> = [
  event: ChangeType,
  doc: T,
  fromSync: boolean
];

export type ChangeListener = (changes: ChangeBufferEvent[]) => void;

export type Patch<T> = Partial<T>;

export abstract class BaseImplementation implements Database {
  private bufferingChanges = false;
  private bufferChangesId = 0;
  protected changeListeners: ChangeListener[] = [];
  protected changeBuffer: ChangeBufferEvent[] = [];

  async all<T extends BaseModel>(type: string): Promise<T[]> {
    return this.find<T>(type);
  }

  async batchModifyDocs({
    upsert = [],
    remove = [],
  }: Operation): Promise<void> {
    const flushId = await this.bufferChanges();

    // Perform from least to most dangerous
    await Promise.all([
      ...upsert.map((doc) => this.upsert(doc, true)),
      ...remove.map((doc) => this.unsafeRemove(doc, true)),
    ]);

    await this.flushChanges(flushId);
  }

  /** buffers database changes and returns a buffer id */
  async bufferChanges(millis = 1000) {
    this.bufferingChanges = true;
    setTimeout(this.flushChanges, millis);
    return ++this.bufferChangesId;
  }

  /** buffers database changes and returns a buffer id */
  async bufferChangesIndefinitely() {
    this.bufferingChanges = true;
    return ++this.bufferChangesId;
  }

  abstract count<T extends BaseModel>(
    type: string,
    query?: Query
  ): Promise<number>;

  async docCreate<T extends BaseModel>(
    type: string,
    ...patches: Patch<T>[]
  ): Promise<T> {
    const doc = await models.initModel<T>(
      type,
      ...patches,
      // Fields that the user can't touch
      {
        type: type,
      }
    );
    return this.insert<T>(doc);
  }

  async docUpdate<T extends BaseModel>(
    originalDoc: T,
    ...patches: Patch<T>[]
  ): Promise<T> {
    // No need to re-initialize the model during update; originalDoc will be in a valid state by virtue of loading
    const doc = await models.initModel<T>(
      originalDoc.type,
      originalDoc,

      // NOTE: This is before `patches` because we want `patch.modified` to win if it has it
      {
        modified: Date.now(),
      },
      ...patches
    );
    return this.update<T>(doc);
  }

  async duplicate<T extends BaseModel>(originalDoc: T, patch: Patch<T> = {}) {
    const flushId = await this.bufferChanges();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    async function next<T extends BaseModel>(docToCopy: T, patch: Patch<T>) {
      const model = mustGetModel(docToCopy.type);
      const overrides = {
        _id: generateId(model.prefix),
        modified: Date.now(),
        created: Date.now(),
        type: docToCopy.type, // Ensure this is not overwritten by the patch
      };

      // 1. Copy the doc
      const newDoc = Object.assign({}, docToCopy, patch, overrides);

      // Don't initialize the model during insert, and simply duplicate
      const createdDoc = await self.insert(newDoc, false, false);

      // 2. Get all the children
      for (const type of models.types()) {
        // Note: We never want to duplicate a response
        if (!models.canDuplicate(type)) {
          continue;
        }

        const parentId = docToCopy._id;
        const children = await self.find(type, { parentId });

        for (const doc of children) {
          await next(doc, { parentId: createdDoc._id });
        }
      }

      return createdDoc;
    }

    const createdDoc = await next(originalDoc, patch);
    await this.flushChanges(flushId);
    return createdDoc;
  }

  abstract find<T extends BaseModel>(
    type: string,
    query?: Query | string,
    sort?: Sort<T>
  ): Promise<T[]>;

  async findMostRecentlyModified<T extends BaseModel>(type: string, query?: Query | undefined, limit?: number | null | undefined): Promise<T[]> {
    const result = await this.find<T>(type, query, { modified: -1 } as Sort<T>);
    if (limit) {
      return result.slice(0, limit);
    }
    return result;
  }

  async flushChanges(id = 0, fake = false) {
    // Only flush if ID is 0 or the current flush ID is the same as passed
    if (id !== 0 && this.bufferChangesId !== id) {
      return;
    }

    this.bufferingChanges = false;
    const changes = [...this.changeBuffer];
    this.changeBuffer = [];

    if (changes.length === 0) {
      // No work to do
      return;
    }

    if (fake) {
      console.log(`[db] Dropped ${changes.length} changes.`);
      return;
    }
    // Notify local listeners too
    for (const fn of this.changeListeners) {
      await fn(changes);
    }
    // Notify remote listeners
    const isMainContext = process.type === "browser";
    if (isMainContext) {
      const windows = electron.BrowserWindow.getAllWindows();

      for (const window of windows) {
        window.webContents.send("db.changes", changes);
      }
    }
  }

  async get<T extends BaseModel>(type: string, id?: string) {
    // Short circuit IDs used to represent nothing
    if (!id || id === "n/a") {
      return null;
    } else {
      return this.getWhere<T>(type, { _id: id });
    }
  }

  async getMostRecentlyModified<T extends BaseModel>(
    type: string,
    query?: Query
  ): Promise<T | null> {
    const docs = await this.findMostRecentlyModified<T>(type, query, 1);
    return docs.length ? docs[0] : null;
  }

  async getWhere<T extends BaseModel>(
    type: string,
    query: Query | Partial<Record<keyof T, SpecificQuery>>
  ): Promise<T | null> {
    const result = await this.find<T>(type, query);
    return result.length > 0 ? result[0] : null;
  }

  abstract init(
    types: string[],
    config: object,
    forceReset?: boolean,
    consoleLog?: typeof console.log
  ): Promise<void>;

  abstract initClient(): Promise<void>;

  abstract insert<T extends BaseModel>(
    doc: T,
    fromSync?: boolean,
    initializeModel?: boolean
  ): Promise<T>;

  onChange(callback: ChangeListener) {
    this.changeListeners.push(callback);
  }

  offChange(callback: ChangeListener) {
    this.changeListeners = this.changeListeners.filter((l) => l !== callback);
  }

  abstract remove<T extends BaseModel>(
    doc: T,
    fromSync?: boolean
  ): Promise<void>;

  abstract removeWhere(type: string, query: Query): Promise<void>;

  /** Removes entries without removing their children */
  abstract unsafeRemove<T extends BaseModel>(
    doc: T,
    fromSync?: boolean
  ): Promise<void>;

  abstract update<T extends BaseModel>(doc: T, fromSync?: boolean): Promise<T>;

  async upsert<T extends BaseModel>(doc: T, fromSync = false): Promise<T> {
    const existingDoc = await this.get<T>(doc.type, doc._id);

    if (existingDoc) {
      return this.update<T>(doc, fromSync);
    } else {
      return this.insert<T>(doc, fromSync);
    }
  }

  async withAncestors<T extends BaseModel>(
    doc: T | null,
    types: string[] = models.types()
  ) {
    if (!doc) {
      return [];
    }

    let docsToReturn: T[] = doc ? [doc] : [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    async function next(docs: T[]): Promise<T[]> {
      const foundDocs: T[] = [];

      for (const d of docs) {
        for (const type of types) {
          // If the doc is null, we want to search for parentId === null
          const another = await self.get<T>(type, d.parentId);
          another && foundDocs.push(another);
        }
      }

      if (foundDocs.length === 0) {
        // Didn't find anything. We're done
        return docsToReturn;
      }

      // Continue searching for children
      docsToReturn = [...docsToReturn, ...foundDocs];
      return next(foundDocs);
    }

    return next([doc]);
  }

  async withDescendants<T extends BaseModel>(
    doc: T | null,
    stopType: string | null = null
  ): Promise<BaseModel[]> {
    let docsToReturn: BaseModel[] = doc ? [doc] : [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    async function next(docs: (BaseModel | null)[]): Promise<BaseModel[]> {
      let foundDocs: BaseModel[] = [];

      for (const doc of docs) {
        if (stopType && doc && doc.type === stopType) {
          continue;
        }

        const promises: Promise<BaseModel[]>[] = [];

        for (const type of models.types()) {
          // If the doc is null, we want to search for parentId === null
          const parentId = doc ? doc._id : null;
          const promise = self.find<BaseModel>(type, { parentId });
          promises.push(promise);
        }

        for (const more of await Promise.all(promises)) {
          foundDocs = [...foundDocs, ...more];
        }
      }

      if (foundDocs.length === 0) {
        // Didn't find anything. We're done
        return docsToReturn;
      }

      // Continue searching for children
      docsToReturn = [...docsToReturn, ...foundDocs];
      return next(foundDocs);
    }

    return next([doc]);
  }

  protected async notifyOfChange<T extends BaseModel>(
    event: ChangeType,
    doc: T,
    fromSync: boolean
  ) {
    this.changeBuffer.push([event, doc, fromSync]);

    // Flush right away if we're not buffering
    if (!this.bufferingChanges) {
      await this.flushChanges();
    }
  }

  static sortList<T extends BaseModel>(list: T[], sort?: Sort<T>): T[] {
    list.sort((itemA, itemB) => {
      return Object.entries(sort ?? {}).reduce((result, [key, direction]) => {
        if (direction !== 1 && direction !== -1) {
          throw new Error("Method not implemented.");
        }
        if (result !== 0) {
          return result;
        }
        if (typeof itemA[key as keyof T] === "string")
          return (
            (itemA[key as keyof T] as string).localeCompare(
              itemB[key as keyof T] as string
            ) * direction
          );
        return (
          (itemA[key as keyof T] as number) -
          (itemB[key as keyof T] as number) * direction
        );
      }, 0);
    });
    return list;
  }

  static filterList<T extends BaseModel>(list: T[], query: Query): T[] {
    return list.filter(item => {
      return Object.entries(query ?? {}).every(([key, value]) => {
        if (typeof value === "object") {
          let valid = true;
          const operators = Object.keys(value);
          operators.forEach((operator) => {
            switch (operator) {
              case "$gt":
                valid &&= item[key as keyof T] > value[operator];
                break;
              case "$in":
                valid &&= value[operator].includes(item[key as keyof T]);
                break;
              case "$nin": {
                valid &&= !value[operator].includes(item[key as keyof T]);
                break;
              }
              default:
                throw new Error("Method not implemented.");
            }
          });

          return valid;
        }
        return item[key as keyof T] === value;
      });
    })
  }
}
