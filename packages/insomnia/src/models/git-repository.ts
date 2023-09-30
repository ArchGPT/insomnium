import { database as db } from '../common/database';
import type { GitCredentials } from '../sync/git/git-vcs';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Import statements ->  */

export type OauthProviderName = 'gitlab' | 'github' | 'custom';

export type GitRepository = BaseModel & BaseGitRepository;
/**** ><> ↑ --------- Type definitions ->  */

export const name = 'Git Repository';

export const type = 'GitRepository';

export const prefix = 'git';

export const canDuplicate = false;

export const canSync = false;
/**** ><> ↑ --------- Constants definitions ->  */

export function init(): BaseGitRepository {
  return {
    needsFullClone: false,
    uri: '',
    credentials: null,
    author: {
      name: '',
      email: '',
    },
    uriNeedsMigration: true,
  };
}
/**** ><> ↑ --------- Initialization function ->  */

export interface BaseGitRepository {
  needsFullClone: boolean;
  uri: string;
  credentials: GitCredentials | null;
  author: {
    name: string;
    email: string;
  };
  uriNeedsMigration: boolean;
}
/**** ><> ↑ --------- Interface definition ->  */

export const isGitRepository = (model: Pick<BaseModel, 'type'>): model is GitRepository => (
  model.type === type
);
/**** ><> ↑ --------- Function to check if a model is a GitRepository ->  */

export function migrate(doc: GitRepository) {
  return doc;
}
/**** ><> ↑ --------- Migrate function ->  */

export function create(patch: Partial<GitRepository> = {}) {
  return db.docCreate<GitRepository>(type, {
    uriNeedsMigration: false,
    ...patch,
  });
}
/**** ><> ↑ --------- Creation function ->  */

export async function getById(id: string) {
  return db.getWhere<GitRepository>(type, { _id: id });
}
/**** ><> ↑ --------- Function to get by ID ->  */

export function update(repo: GitRepository, patch: Partial<GitRepository>) {
  return db.docUpdate<GitRepository>(repo, patch);
}
/**** ><> ↑ --------- Update function ->  */

export function remove(repo: GitRepository) {
  return db.remove(repo);
}
/**** ><> ↑ --------- Remove function ->  */

export function all() {
  return db.all<GitRepository>(type);
}
/**** ><> ↑ --------- Function to get all GitRepository ->  */
