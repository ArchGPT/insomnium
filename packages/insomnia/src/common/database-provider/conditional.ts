import { BaseModel } from "../../models"
import { BaseImplementation, Database, Query, Sort } from "./index"
import { MultipleDatabase } from "./multiple"

export class ConditionalWriter extends MultipleDatabase {
  constructor(primary: Database, secondary: Database, rootId: string) {
    super(primary, [new RejectWriter(secondary, rootId)])
  }
}

class RejectWriter extends BaseImplementation {
  constructor(private readonly database: Database, private rootId: string) {
    super()
  }

  private async getIds<T extends BaseModel>(doc: T): Promise<string[]> {
    return [doc._id, ...(await this.database.withAncestors(doc)).map(doc => doc._id)]
  }

  private async inPath<T extends BaseModel>(doc: T): Promise<boolean> {
    if (doc._id === this.rootId) {
      return true;
    }
    if (doc.parentId === this.rootId) {
      return true;
    }
    return (await this.getIds(doc)).includes(this.rootId);
  }

    count<T extends BaseModel>(type: string, query?: Query | undefined): Promise<number> {
       return this.database.count(type, query)
    }
    find<T extends BaseModel>(type: string, query?: string | Query | undefined, sort?: Sort<T> | undefined): Promise<T[]> {
        return this.database.find<T>(type, query, sort)
    }
    findMostRecentlyModified<T extends BaseModel>(type: string, query?: Query | undefined, limit?: number | null | undefined): Promise<T[]> {
        return this.database.findMostRecentlyModified(type, query, limit);
    }
    init(types: string[], config: object, forceReset?: boolean | undefined, consoleLog?: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void } | undefined): Promise<void> {
        return this.database.init(types, config, forceReset, consoleLog)
    }
    initClient(): Promise<void> {
        return this.database.initClient()
    }
    async insert<T extends BaseModel>(doc: T, fromSync?: boolean | undefined, initializeModel?: boolean | undefined): Promise<T> {
        if (!await this.inPath(doc)) {
          throw new Error()
        }
        return this.insert(doc, fromSync, initializeModel)
    }
    async remove<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<void> {
      if (!await this.inPath(doc)) {
        throw new Error()
      }
      return this.remove(doc, fromSync)
    }
    async removeWhere(type: string, query: Query): Promise<void> {
    const docs = await this.find(type, query)
      await Promise.allSettled(docs.map(doc => this.remove(doc, false)))
    }
  async unsafeRemove<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<void> {
      if (!await this.inPath(doc)) {
        throw new Error()
      }
      return this.unsafeRemove(doc, fromSync)
    }
  async update<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<T> {
      if (!await this.inPath(doc)) {
        throw new Error()
      }
      return this.update(doc, fromSync)
    }
}
