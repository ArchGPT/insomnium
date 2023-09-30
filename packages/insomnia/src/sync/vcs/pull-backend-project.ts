import { DEFAULT_BRANCH_NAME } from '../../common/constants';
import { database } from '../../common/database';
import { RemoteProject } from '../../models/project';
import { isWorkspace } from '../../models/workspace';
import {
  initializeProjectFromTeam,
  initializeWorkspaceFromBackendProject,
} from './initialize-model-from';
import { BackendProjectWithTeam } from './normalize-backend-project-team';
import { interceptAccessError } from './util';
import { VCS } from './vcs';
/**** ><> ↑ --------- Importing necessary modules and definitions from different files ->  */

interface Options {
  vcs: VCS;
  backendProject: BackendProjectWithTeam;
  remoteProjects: RemoteProject[];
}
/**** ><> ↑ --------- Defining the interface Options for the function ->  */

export const pullBackendProject = async ({
  vcs,
  backendProject,
  remoteProjects,
}: Options) => {
  // Set backend project, checkout master, and pull
  await vcs.setBackendProject(backendProject);
  await vcs.checkout([], DEFAULT_BRANCH_NAME);
  const remoteBranches = await interceptAccessError({
    action: 'pull',
    callback: () => vcs.getRemoteBranches(),
    resourceName: backendProject.name,
  });

/**** ><> ↑ --------- Exporting and defining an async function 'pullBackendProject' with logic to set the backend project and perform some operations ->  */
  const defaultBranchMissing = !remoteBranches.includes(DEFAULT_BRANCH_NAME);

  // Find or create the remote project locally
  let project = remoteProjects.find(
    ({ remoteId }) => remoteId === backendProject.team.id
  );
  if (!project) {
    project = await initializeProjectFromTeam(backendProject.team);
    await database.upsert(project);
  }
/**** ><> ↑ --------- Finding or creating the remote project locally ->  */

  let workspaceId;
/**** ><> ↑ --------- Defining variable workspaceId ->  */

  // The default branch does not exist, so we create it and the workspace locally
  if (defaultBranchMissing) {
    const workspace = await initializeWorkspaceFromBackendProject(
      backendProject,
      project
    );
    await database.upsert(workspace);

    workspaceId = workspace._id;
  } else {
/**** ><> ↑ --------- If the default branch does not exist, creating it and the workspace locally ->  */
    await vcs.pull([], project.remoteId); // There won't be any existing docs since it's a new pull

    const flushId = await database.bufferChanges();

    // @ts-expect-error -- TSCONVERSION
    for (const doc of (await vcs.allDocuments()) || []) {
      if (isWorkspace(doc)) {
        doc.parentId = project._id;
        workspaceId = doc._id;
      }
      await database.upsert(doc);
    }

    await database.flushChanges(flushId);
  }
/**** ><> ↑ --------- If the default branch exists, pulling the project and processing the documents ->  */

  return { project, workspaceId };
};
/**** ><> ↑ --------- Returning the project and workspaceId from the function ->  */
