import { BaseModel } from "../../models";
import { BaseImplementation, Query, Sort } from "./index"
import * as models from "../../models"
import { join } from "node:path"

export const FileMode = {
    symlink(): number {
        return 120000
    },
    tree(): number {
        return 40000
    },
    normal(permissions: Record<"owner" | "group" | "other", {write?: boolean; read?:boolean; execute?:boolean}> | string | number): number {
        function bool2number({ write, read, execute }: {write?: boolean; read?:boolean; execute?:boolean}) {
            let mode = 0;
            if (execute) mode += 1;
            if (write) mode += 2;
            if (read) mode += 4;
            return mode
        }
        if (typeof permissions === "number") {
            return 100_000 + permissions;
        }
        if (typeof permissions === "string") {
            const groups = Array.from(permissions.matchAll(/(?<mode>...)/g)).map(i => i.groups?.mode ?? '---')
            return FileMode.normal({
                owner: {
                    read: groups[0].charAt(0) === 'r',
                    write: groups[0].charAt(1) === 'w',
                    execute: groups[0].charAt(2) === 'x',
                },
                group: {
                    read: groups[1].charAt(0) === 'r',
                    write: groups[1].charAt(1) === 'w',
                    execute: groups[1].charAt(2) === 'x',
                },
                other: {
                    read: groups[2].charAt(0) === 'r',
                    write: groups[2].charAt(1) === 'w',
                    execute: groups[2].charAt(2) === 'x',
                },
            })
        }
        return 100_000 + bool2number(permissions.owner) * 100 + bool2number(permissions.group) * 10 + bool2number(permissions.owner)
    },
}

interface GitRunner {
    /**
     * `echo '<<content>>' | git hash-object -w --stdin`
     * @example `hashObject('hello world');`
     * @param content The content of the blob
     * @return the blob hash
     */
    hashObject(content: string): Promise<string>;

    /**
     * `git update-index --add --cacheinfo <<mode>>,<<objectHash>>,<<path>>`
     * @example `updateIndexAdd(100664, '3b18e512dba79e4c8300dd08aeb37f8e728b8dad', 'foobar.txt');`
     * @param mode
     * @param objectHash
     * @param path
     */
    updateIndexAdd(mode: number, objectHash: string, path: string): Promise<void>;

    /**
     * `git update-index --remove -- <<path>>`
     * @example `updateIndexRemove('foobar.txt');`
     * @param path
     */
    updateIndexRemove(path: string): Promise<void>;

    /**
     * `git write-tree`
     */
    writeTree(): Promise<string>;

    /**
     * `echo '<<message>>' | git commit-tree <<treeHash>> -p <<previousCommitHash>>`
     * `echo '<<message>>' | git commit-tree <<treeHash>>`
     * @example `commitTree('update foobar', '3f0fa67e5448c7bc3248333938a69f1aaf0c299f', '7d88fc945a64642e6248aeae05ea4ae1d1d3cb5b');`
     * @param message
     * @param treeHash
     * @param previousCommitHash
     */
    commitTree(message: string, treeHash: string, previousCommitHash?: string): Promise<string>;

    /**
     * `git update-ref <<ref>> <<commitHash>>`
     * @example `updateRef('refs/heads/main', '4be0f30b8c5fb8e5740d3dcd1034c274fa94ba07');`
     * @param ref
     * @param commitHash
     */
    updateRef(ref: string, commitHash: string): Promise<void>;

    /**
     * `git rev-parse <<ref>>`
     * @example `revParse('refs/heads/main');`
     * @param ref
     */
    revParse(ref: string): Promise<string>;

    /**
     * `git ls-tree <<ref>> <<path>>`
     * `git ls-tree <<ref>>`
     * @example `lsTree('refs/heads/main', 'src/');`
     * @param ref
     * @param path
     */
    lsTree(ref: string, path?: string): Promise<GitRunnerLsTree[]>;

    /**
     * `git cat-file <<type>> <<hash>>`
     * @example `catFile('blob', '3b18e512dba79e4c8300dd08aeb37f8e728b8dad');`
     * @param type
     * @param hash
     */
    catFile(type: "blob" | "tree" | "commit" | "tag", hash: string): Promise<string>;

    /**
     * `git show <<ref>>:<<path>>`
     * @example `show('refs/heads/main', 'foobar.txt');`
     * @param ref
     * @param path
     */
    show(ref: string, path: string): Promise<string>;

    /**
     * `git push <<remote>> <<localRef>>:<<remoteRef>>`
     * `git push <<remote>> <<localRef>>:<<localRef>>`
     * @param remote
     * @param localRef
     * @param remoteRef
     */
    push(remote: string, localRef: string, remoteRef?: string): Promise<void>;

    /**
     * `git fetch <<remote>>`
     * @param remote
     */
    fetch(remote: string): Promise<void>;

    /**
     * `git rebase <<ref>>`
     * @param ref
     */
    rebase(ref: string): Promise<void>;
}

interface GitRunnerLsTree {
    mode: string;
    type: "blob" | "tree";
    hash: string;
    path: string;
}

export class GitDatabase extends BaseImplementation {

    constructor(private readonly git: GitRunner, private readonly branch: string) {
        super()
    }

    private getDBFilePath(modelType: string) {
        return join(".insomnium", modelType);
    }

    private getDocFilePath<T extends BaseModel>(
      doc: T | { _id: string; type: string }
    ): string {
        return join(this.getDBFilePath(doc.type), `${doc._id}.json`);
    }

    count<T extends BaseModel>(type: string, query?: Query | undefined): Promise<number> {
        return this.git.lsTree(this.branch, this.getDBFilePath(type))
          .then(list => list.filter(item => item.type === "blob"))
          .then(list => list.length);
    }
    async find<T extends BaseModel>(type: string, query?: Query | undefined, sort?: Sort<T> | undefined): Promise<T[]> {
        if (
          query === undefined ||
          (typeof query === "object" && Object.keys(query).length === 0)
        ) {
            const lines = await this.git.lsTree(this.branch, this.getDBFilePath(type));
            const contents = await Promise.all(lines.filter(line => line.type === 'blob').map(line => this.git.catFile('blob', line.hash).then(content => JSON.parse(content) as T)))
            return BaseImplementation.sortList(contents, sort);
        }

        return BaseImplementation.filterList(await this.find(type, undefined, sort), query);
    }

    get<T extends BaseModel>(
      type: string,
      id?: string | undefined
    ): Promise<T | null> {
        if (!id && id === "n/a") return Promise.resolve(null);
        return this.git.show(this.branch, this.getDocFilePath({ _id: id!, type })).then(content => JSON.parse(content) as T)
    }

    init(types: string[], config: object, forceReset?: boolean | undefined, consoleLog?: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void } | undefined): Promise<void> {
        return Promise.resolve()
    }
    initClient(): Promise<void> {
        return Promise.resolve()
    }
    async insert<T extends BaseModel>(doc: T, fromSync: boolean  = false, initializeModel: boolean = true): Promise<T> {
        const docWithDefaults = initializeModel
          ? await models.initModel<T>(doc.type, doc)
          : doc;

        const objectPath = this.getDocFilePath(doc);
        const objectHash = await this.git.hashObject(JSON.stringify(docWithDefaults))
        await this.git.updateIndexAdd(FileMode.normal('644'), objectHash, objectPath)
        const treeHash = await this.git.writeTree()
        const commitHash = await this.git.commitTree(`update ${objectPath}`, treeHash, await this.git.revParse(this.branch))
        await this.git.updateRef(this.branch, commitHash)

        this.notifyOfChange("insert", docWithDefaults, fromSync);

        return docWithDefaults;
    }
    async remove<T extends BaseModel>(doc: T, fromSync: boolean = false): Promise<void> {
        const flushId = await this.bufferChanges();

        const docs = await this.withDescendants(doc);

        await Promise.all(docs.map((doc) => this.git.updateIndexRemove(this.getDocFilePath(doc))));
        docs.map((d) => this.notifyOfChange("remove", d, fromSync));
        const treeHash = await this.git.writeTree()
        const commitHash = await this.git.commitTree(`remove ${this.getDocFilePath(doc)} and children`, treeHash, await this.git.revParse(this.branch))
        await this.git.updateRef(this.branch, commitHash)
        await this.flushChanges(flushId);
    }
    async removeWhere(type: string, query: Query): Promise<void> {
        const flushId = await this.bufferChanges();

        const foundDocs = await this.find(type, query);
        await Promise.all(
          foundDocs.map(async (doc) => {
              const docs = await this.withDescendants(doc);

              await Promise.all(docs.map((doc) => this.git.updateIndexRemove(this.getDocFilePath(doc))));
              docs.map((d) => this.notifyOfChange("remove", d, false));
          })
        );
        const treeHash = await this.git.writeTree()
        const commitHash = await this.git.commitTree(`remove ${foundDocs.length} documents and children`, treeHash, await this.git.revParse(this.branch))
        await this.git.updateRef(this.branch, commitHash)
        await this.flushChanges(flushId);
    }
    async unsafeRemove<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<void> {
        const objectPath = this.getDocFilePath(doc);
        await this.git.updateIndexRemove(this.getDocFilePath(doc));
        const treeHash = await this.git.writeTree()
        const commitHash = await this.git.commitTree(`remove ${objectPath}`, treeHash, await this.git.revParse(this.branch))
        await this.git.updateRef(this.branch, commitHash)
    }
    update<T extends BaseModel>(doc: T, fromSync?: boolean | undefined): Promise<T> {
        return this.insert(doc, fromSync, false);
    }


}
