/* eslint-disable prefer-rest-params -- don't want to change ...arguments usage for these sensitive functions without more testing */
import electron from "electron";
// to-do > "@seald-io/nedb": "^2.0.0",
// import NeDB from '@seald-io/nedb';
import NeDB from "nedb";
import fsPath from "path";
import { v4 as uuidv4 } from "uuid";

import { CookieJar } from "../../models/cookie-jar";
import { Environment } from "../../models/environment";
import { GitRepository } from "../../models/git-repository";
import type { BaseModel } from "../../models";
import * as models from "../../models/index";
import type { Workspace } from "../../models/workspace";
import { DB_PERSIST_INTERVAL } from "../constants";
import {
  BaseImplementation,
  Database,
  Operation,
  Query,
  Sort,
  ChangeBufferEvent,
  ModelQuery,
  Patch,
} from "./index";

class NeDBImplementation extends BaseImplementation implements Database {
  async all<T extends BaseModel>(type: string): Promise<T[]> {
    if (db._empty) {
      return _send<T[]>("all", ...arguments);
    }
    return super.all(type);
  }

  async batchModifyDocs({ upsert = [], remove = [] }: Operation) {
    if (db._empty) {
      return _send<void>("batchModifyDocs", ...arguments);
    }
    return super.batchModifyDocs({ upsert, remove });
  }

  /** buffers database changes and returns a buffer id */
  async bufferChanges(millis = 1000) {
    if (db._empty) {
      return _send<number>("bufferChanges", ...arguments);
    }
    return super.bufferChanges(millis);
  }

  /** buffers database changes and returns a buffer id */
  async bufferChangesIndefinitely() {
    if (db._empty) {
      return _send<number>("bufferChangesIndefinitely", ...arguments);
    }
    return super.bufferChangesIndefinitely();
  }

  async count<T extends BaseModel>(type: string, query: Query = {}) {
    if (db._empty) {
      return _send<number>("count", ...arguments);
    }
    return new Promise<number>((resolve, reject) => {
      (db[type] as NeDB<T>).count(query, (err, count) => {
        if (err) {
          return reject(err);
        }

        resolve(count);
      });
    });
  }

  async duplicate<T extends BaseModel>(originalDoc: T, patch: Patch<T> = {}) {
    if (db._empty) {
      return _send<T>("duplicate", ...arguments);
    }
    return super.duplicate(originalDoc, patch);
  }

  async find<T extends BaseModel>(
    type: string,
    query: Query | string = {},
    sort: Sort = { created: 1 }
  ) {
    if (db._empty) {
      return _send<T[]>("find", ...arguments);
    }
    return new Promise<T[]>((resolve, reject) => {
      (db[type] as NeDB<T>)
        .find(query)
        .sort(sort)
        .exec(async (err, rawDocs) => {
          if (err) {
            reject(err);
            return;
          }

          const docs: T[] = [];

          for (const rawDoc of rawDocs) {
            docs.push(await models.initModel(type, rawDoc));
          }

          resolve(docs);
        });
    });
  }

  async findMostRecentlyModified<T extends BaseModel>(
    type: string,
    query: Query = {},
    limit: number | null = null
  ) {
    if (db._empty) {
      return _send<T[]>("findMostRecentlyModified", ...arguments);
    }
    return new Promise<T[]>((resolve) => {
      (db[type] as NeDB<T>)
        .find(query)
        .sort({
          modified: -1,
        })
        // @ts-expect-error -- TSCONVERSION limit shouldn't be applied if it's null, or default to something that means no-limit
        .limit(limit)
        .exec(async (err, rawDocs) => {
          if (err) {
            console.warn("[db] Failed to find docs", err);
            resolve([]);
            return;
          }

          const docs: T[] = [];

          for (const rawDoc of rawDocs) {
            docs.push(await models.initModel(type, rawDoc));
          }

          resolve(docs);
        });
    });
  }

  async flushChanges(id = 0, fake = false) {
    if (db._empty) {
      return _send<void>("flushChanges", ...arguments);
    }
    return super.flushChanges(id, fake);
  }

  async get<T extends BaseModel>(type: string, id?: string) {
    if (db._empty) {
      return _send<T>("get", ...arguments);
    }

    // Short circuit IDs used to represent nothing
    if (!id || id === "n/a") {
      return null;
    } else {
      return this.getWhere<T>(type, { _id: id });
    }
  }

  getMostRecentlyModified<T extends BaseModel>(
    type: string,
    query: Query = {}
  ) {
    if (db._empty) {
      return _send<T>("getMostRecentlyModified", ...arguments);
    }
    return super.getMostRecentlyModified<T>(type, query);
  }

  async getWhere<T extends BaseModel>(
    type: string,
    query: ModelQuery<T> | Query
  ) {
    if (db._empty) {
      return _send<T>("getWhere", ...arguments);
    }
    return super.getWhere<T>(type, query);
  }

  async init(
    types: string[],
    config: NeDB.DataStoreOptions = {},
    forceReset = false,
    consoleLog: typeof console.log = console.log
  ) {
    if (forceReset) {
      this.changeListeners = [];

      for (const attr of Object.keys(db)) {
        if (attr === "_empty") {
          continue;
        }

        delete db[attr];
      }
    }

    // Fill in the defaults
    for (const modelType of types) {
      if (db[modelType]) {
        consoleLog(`[db] Already initialized DB.${modelType}`);
        continue;
      }

      const filePath = getDBFilePath(modelType);
      const collection = new NeDB(
        Object.assign(
          {
            autoload: true,
            filename: filePath,
            corruptAlertThreshold: 0.9,
          },
          config
        )
      );
      if (!config.inMemoryOnly) {
        collection.persistence.setAutocompactionInterval(DB_PERSIST_INTERVAL);
      }
      db[modelType] = collection;
    }

    delete db._empty;
    electron.ipcMain.on("db.fn", async (e, fnName, replyChannel, ...args) => {
      try {
        // @ts-expect-error -- mapping unsoundness
        const result = await this[fnName](...args);
        e.sender.send(replyChannel, null, result);
      } catch (err) {
        e.sender.send(replyChannel, {
          message: err.message,
          stack: err.stack,
        });
      }
    });

    // NOTE: Only repair the DB if we're not running in memory. Repairing here causes tests to hang indefinitely for some reason.
    // TODO: Figure out why this makes tests hang
    if (!config.inMemoryOnly) {
      await _fixDBShape();
      consoleLog(`[db] Initialized DB at ${getDBFilePath("$TYPE")}`);
    }

    // This isn't the best place for this but w/e
    // Listen for response deletions and delete corresponding response body files
    this.onChange(async (changes: ChangeBufferEvent[]) => {
      for (const [type, doc] of changes) {
        // TODO(TSCONVERSION) what's returned here is the entire model implementation, not just a model
        // The type definition will be a little confusing
        const m: Record<string, any> | null = models.getModel(doc.type);

        if (!m) {
          continue;
        }

        if (type === "remove" && typeof m.hookRemove === "function") {
          try {
            await m.hookRemove(doc, consoleLog);
          } catch (err) {
            consoleLog(
              `[db] Delete hook failed for ${type} ${doc._id}: ${err.message}`
            );
          }
        }

        if (type === "insert" && typeof m.hookInsert === "function") {
          try {
            await m.hookInsert(doc, consoleLog);
          } catch (err) {
            consoleLog(
              `[db] Insert hook failed for ${type} ${doc._id}: ${err.message}`
            );
          }
        }

        if (type === "update" && typeof m.hookUpdate === "function") {
          try {
            await m.hookUpdate(doc, consoleLog);
          } catch (err) {
            consoleLog(
              `[db] Update hook failed for ${type} ${doc._id}: ${err.message}`
            );
          }
        }
      }
    });

    for (const model of models.all()) {
      // @ts-expect-error -- TSCONVERSION optional type on response
      if (typeof model.hookDatabaseInit === "function") {
        // @ts-expect-error -- TSCONVERSION optional type on response
        await model.hookDatabaseInit?.(consoleLog);
      }
    }
  }

  async initClient() {
    electron.ipcRenderer.on("db.changes", async (_e, changes) => {
      for (const fn of this.changeListeners) {
        await fn(changes);
      }
    });
    console.log("[db] Initialized DB client");
  }

  async insert<T extends BaseModel>(
    doc: T,
    fromSync = false,
    initializeModel = true
  ) {
    if (db._empty) {
      return _send<T>("insert", ...arguments);
    }
    return new Promise<T>(async (resolve, reject) => {
      let docWithDefaults: T | null = null;

      try {
        if (initializeModel) {
          docWithDefaults = await models.initModel<T>(doc.type, doc);
        } else {
          docWithDefaults = doc;
        }
      } catch (err) {
        return reject(err);
      }

      (db[doc.type] as NeDB<T>).insert(docWithDefaults, (err, newDoc: T) => {
        if (err) {
          return reject(err);
        }

        resolve(newDoc);
        // NOTE: This needs to be after we resolve
        this.notifyOfChange("insert", newDoc, fromSync);
      });
    });
  }

  async remove<T extends BaseModel>(doc: T, fromSync = false) {
    if (db._empty) {
      return _send<void>("remove", ...arguments);
    }

    const flushId = await this.bufferChanges();

    const docs = await this.withDescendants(doc);
    const docIds = docs.map((d) => d._id);
    const types = [...new Set(docs.map((d) => d.type))];

    // Don't really need to wait for this to be over;
    types.map((t) =>
      db[t].remove(
        {
          _id: {
            $in: docIds,
          },
        },
        {
          multi: true,
        }
      )
    );

    docs.map((d) => this.notifyOfChange("remove", d, fromSync));
    await this.flushChanges(flushId);
  }

  async removeWhere<T extends BaseModel>(type: string, query: Query) {
    if (db._empty) {
      return _send<void>("removeWhere", ...arguments);
    }
    const flushId = await this.bufferChanges();

    for (const doc of await this.find<T>(type, query)) {
      const docs = await this.withDescendants(doc);
      const docIds = docs.map((d) => d._id);
      const types = [...new Set(docs.map((d) => d.type))];

      // Don't really need to wait for this to be over;
      types.map((t) =>
        db[t].remove(
          {
            _id: {
              $in: docIds,
            },
          },
          {
            multi: true,
          }
        )
      );
      docs.map((d) => this.notifyOfChange("remove", d, false));
    }

    await this.flushChanges(flushId);
  }

  /** Removes entries without removing their children */
  async unsafeRemove<T extends BaseModel>(doc: T, fromSync = false) {
    if (db._empty) {
      return _send<void>("unsafeRemove", ...arguments);
    }

    (db[doc.type] as NeDB<T>).remove({ _id: doc._id });
    this.notifyOfChange("remove", doc, fromSync);
  }

  async update<T extends BaseModel>(doc: T, fromSync = false) {
    if (db._empty) {
      return _send<T>("update", ...arguments);
    }

    return new Promise<T>(async (resolve, reject) => {
      let docWithDefaults: T;

      try {
        docWithDefaults = await models.initModel<T>(doc.type, doc);
      } catch (err) {
        return reject(err);
      }

      (db[doc.type] as NeDB<T>).update(
        { _id: docWithDefaults._id },
        docWithDefaults,
        // TODO(TSCONVERSION) see comment below, upsert can happen automatically as part of the update
        // @ts-expect-error -- TSCONVERSION expects 4 args but only sent 3. Need to validate what UpdateOptions should be.
        (err) => {
          if (err) {
            return reject(err);
          }

          resolve(docWithDefaults);
          // NOTE: This needs to be after we resolve
          this.notifyOfChange("update", docWithDefaults, fromSync);
        }
      );
    });
  }

  // TODO(TSCONVERSION) the update method above can now take an upsert property
  async upsert<T extends BaseModel>(doc: T, fromSync = false) {
    if (db._empty) {
      return _send<T>("upsert", ...arguments);
    }
    return super.upsert(doc, fromSync);
  }

  async withAncestors<T extends BaseModel>(
    doc: T | null,
    types: string[] = models.types()
  ) {
    if (db._empty) {
      return _send<T[]>("withAncestors", ...arguments);
    }
    return super.withAncestors(doc, types);
  }

  async withDescendants<T extends BaseModel>(
    doc: T | null,
    stopType: string | null = null
  ): Promise<BaseModel[]> {
    if (db._empty) {
      return _send<BaseModel[]>("withDescendants", ...arguments);
    }
    return super.withDescendants(doc, stopType);
  }
}

export const database = new NeDBImplementation();

interface DB {
  [index: string]: NeDB;
}

// @ts-expect-error -- TSCONVERSION _empty doesn't match the index signature, use something other than _empty in future
const db: DB = {
  _empty: true,
} as DB;

// ~~~~~~~ //
// HELPERS //
// ~~~~~~~ //

function getDBFilePath(modelType: string) {
  // NOTE: Do not EVER change this. EVER!
  return fsPath.join(
    process.env["INSOMNIA_DATA_PATH"] || electron.app.getPath("userData"),
    `insomnia.${modelType}.db`
  );
}

// ~~~~~~~~~~~~~~~~~~~ //
// DEFAULT MODEL STUFF //
// ~~~~~~~~~~~~~~~~~~~ //

// ~~~~~~~ //
// Helpers //
// ~~~~~~~ //
async function _send<T>(fnName: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    const replyChannel = `db.fn.reply:${uuidv4()}`;
    electron.ipcRenderer.send("db.fn", fnName, replyChannel, ...args);
    electron.ipcRenderer.once(replyChannel, (_e, err, result: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Run various database repair scripts
 */
export async function _fixDBShape() {
  console.log("[fix] Running database repairs");
  const workspaces = await database.find<Workspace>(models.workspace.type);
  for (const workspace of workspaces) {
    await _repairBaseEnvironments(workspace);
    await _fixMultipleCookieJars(workspace);
    await _applyApiSpecName(workspace);
  }

  console.log(["workspaces"], workspaces);

  for (const gitRepository of await database.find<GitRepository>(
    models.gitRepository.type
  )) {
    await _fixOldGitURIs(gitRepository);
  }
}

/**
 * This function ensures that apiSpec exists for each workspace
 * If the filename on the apiSpec is not set or is the default initialized name
 * It will apply the workspace name to it
 */
async function _applyApiSpecName(workspace: Workspace) {
  const apiSpec = await models.apiSpec.getByParentId(workspace._id);
  if (apiSpec === null) {
    return;
  }

  if (
    !apiSpec.fileName ||
    apiSpec.fileName === models.apiSpec.init().fileName
  ) {
    await models.apiSpec.update(apiSpec, {
      fileName: workspace.name,
    });
  }
}

/**
 * This function repairs workspaces that have multiple base environments. Since a workspace
 * can only have one, this function walks over all base environments, merges the data, and
 * moves all children as well.
 */
async function _repairBaseEnvironments(workspace: Workspace) {
  const baseEnvironments = await database.find<Environment>(
    models.environment.type,
    {
      parentId: workspace._id,
    }
  );

  // Nothing to do here
  if (baseEnvironments.length <= 1) {
    return;
  }

  const chosenBase = baseEnvironments[0];

  for (const baseEnvironment of baseEnvironments) {
    if (baseEnvironment._id === chosenBase._id) {
      continue;
    }

    chosenBase.data = Object.assign(baseEnvironment.data, chosenBase.data);
    const subEnvironments = await database.find<Environment>(
      models.environment.type,
      {
        parentId: baseEnvironment._id,
      }
    );

    for (const subEnvironment of subEnvironments) {
      await database.docUpdate(subEnvironment, {
        parentId: chosenBase._id,
      });
    }

    // Remove unnecessary base env
    await database.remove(baseEnvironment);
  }

  // Update remaining base env
  await database.update(chosenBase);
  console.log(
    `[fix] Merged ${baseEnvironments.length} base environments under ${workspace.name}`
  );
}

/**
 * This function repairs workspaces that have multiple cookie jars. Since a workspace
 * can only have one, this function walks over all jars and merges them and their cookies
 * together.
 */
async function _fixMultipleCookieJars(workspace: Workspace) {
  const cookieJars = await database.find<CookieJar>(models.cookieJar.type, {
    parentId: workspace._id,
  });

  // Nothing to do here
  if (cookieJars.length <= 1) {
    return;
  }

  const chosenJar = cookieJars[0];

  for (const cookieJar of cookieJars) {
    if (cookieJar._id === chosenJar._id) {
      continue;
    }

    for (const cookie of cookieJar.cookies) {
      if (chosenJar.cookies.find((c) => c.id === cookie.id)) {
        continue;
      }

      chosenJar.cookies.push(cookie);
    }

    // Remove unnecessary jar
    await database.remove(cookieJar);
  }

  // Update remaining jar
  await database.update(chosenJar);
  console.log(
    `[fix] Merged ${cookieJars.length} cookie jars under ${workspace.name}`
  );
}

// Append .git to old git URIs to mimic previous isomorphic-git behaviour
async function _fixOldGitURIs(doc: GitRepository) {
  if (!doc.uriNeedsMigration) {
    return;
  }

  if (!doc.uri.endsWith(".git")) {
    doc.uri += ".git";
  }

  doc.uriNeedsMigration = false;
  await database.update(doc);
  console.log(`[fix] Fixed git URI for ${doc._id}`);
}
