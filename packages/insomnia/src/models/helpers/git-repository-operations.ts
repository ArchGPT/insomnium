import * as models from '../../models';
import type { GitRepository } from '../../models/git-repository';
/**** ><> ↑ --------- Import statements ->  */

export const createGitRepository = async (workspaceId: string, repo: Partial<GitRepository>) => {
  const newRepo = await models.gitRepository.create(repo);
  const meta = await models.workspaceMeta.getOrCreateByParentId(workspaceId);
  await models.workspaceMeta.update(meta, {
    gitRepositoryId: newRepo._id,
  });
};
/**** ><> ↑ --------- Function to create a Git repository ->  */

export const deleteGitRepository = async (repo: GitRepository) => {
  const id = repo._id;
  const workspaceMeta = await models.workspaceMeta.getByGitRepositoryId(id);

  if (workspaceMeta) {
    await models.workspaceMeta.update(workspaceMeta, {
      gitRepositoryId: null,
      cachedGitLastCommitTime: null,
      cachedGitRepositoryBranch: null,
      cachedGitLastAuthor: null,
    });
  }

  await models.gitRepository.remove(repo);
};
/**** ><> ↑ --------- Function to delete a Git repository ->  */
