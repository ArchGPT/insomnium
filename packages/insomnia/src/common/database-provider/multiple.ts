import { BaseModel } from "../../models"
import { BaseImplementation, Database, Query, Sort, SpecificQuery } from "./index"

export class MultipleDatabase extends BaseImplementation {
  constructor(private primary: Database, private readonly secondaries: Database[]) {
    super()
  }

  private deduplicate<T extends BaseModel>(docs: T[]): T[] {
    return Array.from(docs.reduce((grouped, doc) => {
      if (!grouped.has(doc._id)) {
        grouped.set(doc._id, doc)
      }
      return grouped;
    }, new Map<string, T>() as Map<string, T>).values())
  }

  count(type: string, query?: Query | undefined): Promise<number> {
    return Promise.allSettled([this.primary.count(type, query), ...this.secondaries.map(database => database.count(type, query))])
      .then(_ => _.filter(settled => settled.status === "fulfilled") as PromiseFulfilledResult<number>[])
      .then(_ => _.map(settled => settled.value))
      .then(_ => Math.max(..._.flat()))
  }

  find<T extends BaseModel>(type: string, query?: string | Query | undefined, sort?: Sort<T> | undefined): Promise<T[]> {
    return Promise.allSettled([this.primary.find(type, query, sort), ...this.secondaries.map(database => database.find(type, query, sort))])
      .then(_ => _.filter(settled => settled.status === "fulfilled") as PromiseFulfilledResult<T[]>[])
      .then(_ => _.map(settled => settled.value))
      .then(_ => _.flat())
      .then(this.deduplicate)
  }

  findMostRecentlyModified<T extends BaseModel>(type: string, query?: Query | undefined, limit?: number | null | undefined): Promise<T[]> {
    return Promise.allSettled([this.primary.findMostRecentlyModified(type, query, limit), ...this.secondaries.map(database => database.findMostRecentlyModified(type, query, limit))])
      .then(_ => _.filter(settled => settled.status === "fulfilled") as PromiseFulfilledResult<T[]>[])
      .then(_ => _.map(settled => settled.value))
      .then(_ => _.flat())
      .then(this.deduplicate)
  }

  get<T extends BaseModel>(type: string, id?: string | undefined): Promise<T | null> {
    return Promise.any([this.primary.get<T>(type, id), ...this.secondaries.map(database => database.get<T>(type, id))])
  }

  getMostRecentlyModified<T extends BaseModel>(type: string, query?: Query | undefined): Promise<T | null> {
    return Promise.any([this.primary.getMostRecentlyModified<T>(type, query), ...this.secondaries.map(database => database.getMostRecentlyModified<T>(type, query))])
  }

  getWhere<T extends BaseModel>(type: string, query: Query | Partial<Record<keyof T, SpecificQuery>>): Promise<T | null> {
    return Promise.any([this.primary.getWhere<T>(type, query), ...this.secondaries.map(database => database.getWhere(type, query))])
  }

  init(types: string[], config: object, forceReset?: boolean | undefined, consoleLog?: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
  } | undefined): Promise<void> {
    return Promise.allSettled([this.primary.init(types, config, forceReset, consoleLog), ...this.secondaries.map(database => database.init(types, config, forceReset, consoleLog))]).then(_ => {})
  }

  initClient(): Promise<void> {
    return Promise.allSettled([this.primary.initClient(), ...this.secondaries.map(database => database.initClient())]).then(_ => {})
  }

  async insert<T extends BaseModel>(doc: T, fromSync?: boolean | undefined, initializeModel?: boolean | undefined): Promise<T> {
    const document = await this.primary.insert<T>(doc, fromSync, initializeModel);
    await Promise.allSettled(this.secondaries.map(database => database.upsert(document, fromSync)))
    return document
  }

  remove<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<void> {
    return Promise.allSettled([this.primary.remove(doc, fromSync), ...this.secondaries.map(database => database.remove(doc, fromSync))]).then(_ => {})
  }

  removeWhere(type: string, query: Query): Promise<void> {
    return Promise.allSettled([this.primary.removeWhere(type, query), ...this.secondaries.map(database => database.removeWhere(type, query))]).then(_ => {})
  }

  unsafeRemove<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<void> {
    return Promise.allSettled([this.primary.unsafeRemove(doc, fromSync), ...this.secondaries.map(database => database.unsafeRemove(doc, fromSync))]).then(_ => {})
  }

  update<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<T> {
    return Promise.any([this.primary.update<T>(doc, fromSync), ...this.secondaries.map(database => database.update<T>(doc, fromSync))])
  }

  async upsert<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<T> {
    const document = await this.primary.upsert<T>(doc, fromSync);
    await Promise.allSettled(this.secondaries.map(database => database.upsert(document, fromSync)))
    return document
  }

  withAncestors<T extends BaseModel>(doc: T | null, types?: string[] | undefined): Promise<T[]> {
    return Promise.allSettled([this.primary.withAncestors<T>(doc, types), ...this.secondaries.map(database => database.withAncestors<T>(doc, types))])
      .then(_ => _.filter(settled => settled.status === "fulfilled") as PromiseFulfilledResult<T[]>[])
      .then(_ => _.map(settled => settled.value))
      .then(_ => _.flat())
      .then(this.deduplicate)
  }

  withDescendants<T extends BaseModel>(doc: T | null, stopType?: string | null | undefined): Promise<BaseModel[]> {
    return Promise.allSettled([this.primary.withDescendants<T>(doc, stopType), ...this.secondaries.map(database => database.withDescendants<T>(doc, stopType))])
      .then(_ => _.filter(settled => settled.status === "fulfilled") as PromiseFulfilledResult<T[]>[])
      .then(_ => _.map(settled => settled.value))
      .then(_ => _.flat())
      .then(this.deduplicate)
  }

}
