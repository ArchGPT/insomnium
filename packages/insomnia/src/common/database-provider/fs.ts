import * as models from "../../models";
import { BaseModel } from "../../models";
import {
  BaseImplementation,
  ChangeBufferEvent,
  Database,
  Query,
  Sort,
} from "./index";
import {
  access,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import electron from "electron";

class FSDatabase extends BaseImplementation implements Database {
  private rootPath: string = "";
  private getDBFilePath(modelType: string) {
    // NOTE: Do not EVER change this. EVER!
    return join(this.rootPath, "insomnia.DB", modelType);
  }

  private getDocFilePath<T extends BaseModel>(
    doc: T | { _id: string; type: string }
  ): string {
    // NOTE: Do not EVER change this. EVER!
    return join(this.getDBFilePath(doc.type), `${doc._id}.json`);
  }

  count<T extends BaseModel>(
    type: string,
    query?: Query | undefined
  ): Promise<number> {
    if (query !== undefined) {
      throw new Error("Method not implemented.");
    }
    return readdir(this.getDBFilePath(type)).then(
      (paths) => paths.filter((path) => path.endsWith(".json")).length
    );
  }

  async find<T extends BaseModel>(
    type: string,
    query?: string | Query,
    sort?: Sort<T>
  ): Promise<T[]> {
    if (
      query === undefined ||
      (typeof query === "string" && query.length === 0) ||
      (typeof query === "object" && Object.keys(query).length === 0)
    ) {
      let filesPath: string[] = [];
      try {
        filesPath = (await readdir(this.getDBFilePath(type))).filter((path) =>
          path.endsWith(".json")
        );
      } catch (e) {
        console.error(e);
        filesPath = [];
      }
      const rawFiles = await Promise.all(
        filesPath.map((path) =>
          readFile(join(this.getDBFilePath(type), path), {
            encoding: "utf8",
          }).then((body) => JSON.parse(body) as T)
        )
      );
      const files = await Promise.all(
        rawFiles.map((file) => models.initModel<T>(type, file))
      );
      files.sort((itemA, itemB) => {
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
      return files;
    }

    return (await this.find<T>(type)).filter((item) => {
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
    });
  }

  async findMostRecentlyModified<T extends BaseModel>(
    type: string,
    query?: Query | undefined,
    limit?: number | null | undefined
  ): Promise<T[]> {
    const result = await this.find<T>(type, query, { modified: -1 } as Sort<T>);
    if (limit) {
      return result.slice(0, limit);
    }
    return result;
  }

  get<T extends BaseModel>(
    type: string,
    id?: string | undefined
  ): Promise<T | null> {
    if (!id && id === "n/a") return Promise.resolve(null);
    return readFile(this.getDocFilePath({ _id: id!, type }), {
      encoding: "utf8",
    }).then((body) => JSON.parse(body) as T);
  }

  async init(
    types: string[],
    config = {},
    forceReset: boolean = false,
    consoleLog: typeof console.log = console.log
  ): Promise<void> {
    this.rootPath ||=
      process.env["INSOMNIA_DATA_PATH"] || electron.app?.getPath("userData");
    await Promise.all(
      types.map(async (type) => {
        const path = this.getDBFilePath(type);
        try {
          await access(path);
        } catch (e) {
          await mkdir(path, { mode: 0o755, recursive: true });
        }
      })
    );
  }

  async initClient() {
    this.rootPath ||=
      process.env["INSOMNIA_DATA_PATH"] || window?.app?.getPath("userData");
    console.log("[db] Initialized DB client");
  }

  async insert<T extends BaseModel>(
    doc: T,
    fromSync: boolean = false,
    initializeModel: boolean = true
  ): Promise<T> {
    const docWithDefaults = initializeModel
      ? await models.initModel<T>(doc.type, doc)
      : doc;

    return writeFile(
      this.getDocFilePath(docWithDefaults),
      JSON.stringify(docWithDefaults),
      { encoding: "utf8" }
    ).then((_) => {
      // NOTE: This needs to be after we resolve
      this.notifyOfChange("insert", docWithDefaults, fromSync);
      return docWithDefaults;
    });
  }

  async remove<T extends BaseModel>(
    doc: T,
    fromSync: boolean = false
  ): Promise<void> {
    const flushId = await this.bufferChanges();

    const docs = await this.withDescendants(doc);

    await Promise.all(docs.map((doc) => unlink(this.getDocFilePath(doc))));
    docs.map((d) => this.notifyOfChange("remove", d, fromSync));
    await this.flushChanges(flushId);
  }

  async removeWhere(type: string, query: Query): Promise<void> {
    const flushId = await this.bufferChanges();

    const foundDocs = await this.find(type, query);
    await Promise.all(
      foundDocs.map(async (doc) => {
        const docs = await this.withDescendants(doc);

        await Promise.all(docs.map((doc) => unlink(this.getDocFilePath(doc))));
        docs.map((d) => this.notifyOfChange("remove", d, false));
      })
    );
    await this.flushChanges(flushId);
  }

  async unsafeRemove<T extends BaseModel>(
    doc: T,
    fromSync: boolean = false
  ): Promise<void> {
    await unlink(this.getDocFilePath(doc));
    this.notifyOfChange("remove", doc, fromSync);
  }

  async update<T extends BaseModel>(
    doc: T,
    fromSync: boolean = false
  ): Promise<T> {
    const docWithDefaults = await models.initModel<T>(doc.type, doc);

    return writeFile(
      this.getDocFilePath(docWithDefaults),
      JSON.stringify(docWithDefaults),
      { encoding: "utf8" }
    ).then((_) => {
      // NOTE: This needs to be after we resolve
      this.notifyOfChange("update", docWithDefaults, fromSync);
      return docWithDefaults;
    });
  }
}

export const database = new FSDatabase();
