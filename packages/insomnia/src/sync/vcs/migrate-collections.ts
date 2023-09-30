import { isLoggedIn } from '../../account/session';
import { database } from '../../common/database';
import { isNotNullOrUndefined } from '../../common/misc';
import * as models from '../../models';
import { isRemoteProject, RemoteProject } from '../../models/project';
import {  isCollection, Workspace } from '../../models/workspace';
import { Team } from '../types';
import { initializeProjectFromTeam } from './initialize-model-from';
import { VCS } from './vcs';
/**** ><> ↑ --------- Importing modules and dependencies ->  */

export const logCollectionMovedToProject = (collection: Workspace, remoteProject: RemoteProject) => {
  console.log('[sync] collection has been moved to the remote project to which it belongs', {
    collection: {
      id : collection._id,
      name: collection.name,
    },
    project: {
      id: remoteProject._id,
      name: remoteProject.name,
    },
  });
};
/**** ><> ↑ --------- Definition of logCollectionMovedToProject function ->  */

export const migrateCollectionsIntoRemoteProject = async (vcs: VCS) => {
  console.log('[sync] checking for collections which need to be moved into a remote project');

  // If not logged in, exit
  if (!isLoggedIn()) {
    return;
  }
/**** ><> ↑ --------- Initialising migrateCollectionsIntoRemoteProject function and checking if user is logged in ->  */

  const collections = (await models.workspace.all()).filter(isCollection);
  const remoteProjects = (await models.project.all()).filter(isRemoteProject);
/**** ><> ↑ --------- Fetching collections and remote projects ->  */

  // Are there any collections that have sync setup but are not in a remote project?
  const isNotInRemoteProject = (collection: Workspace) => !Boolean(remoteProjects.find(project => project._id === collection.parentId));
  const hasLocalProject = (collection: Workspace) => vcs.hasBackendProjectForRootDocument(collection._id);

  const needsMigration = (await Promise.all(collections.map(async coll => await hasLocalProject(coll) && isNotInRemoteProject(coll) ? coll : null))).filter(isNotNullOrUndefined);
/**** ><> ↑ --------- Defining helper functions for the migration process and identifying collections that need migration ->  */

  // If nothing to migrate, exit
  if (!needsMigration.length) {
    return;
  }
/**** ><> ↑ --------- Checking if there's anything to migrate ->  */

  const remoteBackendProjectsInAnyTeam = await vcs.remoteBackendProjectsInAnyTeam();
  const findRemoteBackendProject = (collection: Workspace) => remoteBackendProjectsInAnyTeam.find(project => project.rootDocumentId === collection._id);
  const findRemoteProjectByTeam = (team: Team) => remoteProjects.find(project => project.remoteId === team.id);

/**** ><> ↑ --------- Fetching remote backend projects and defining more helper functions ->  */
  const upsert: (Workspace | RemoteProject)[] = [];

  for (const collection of needsMigration) {
    const remoteBackendProject = findRemoteBackendProject(collection);

    if (!remoteBackendProject) {
      continue;
    }

    let remoteProject = findRemoteProjectByTeam(remoteBackendProject.team);

    if (!remoteProject) {
      remoteProject = await initializeProjectFromTeam(remoteBackendProject.team);
      upsert.push(remoteProject);
    }

    collection.parentId = remoteProject._id;
    upsert.push(collection);
    logCollectionMovedToProject(collection, remoteProject);
  }
/**** ><> ↑ --------- Iteration over collections that need migration, with associated logic ->  */

  if (upsert.length) {
    await database.batchModifyDocs({ upsert });
  }
};
/**** ><> ↑ --------- Database operation to update the docs ->  */
