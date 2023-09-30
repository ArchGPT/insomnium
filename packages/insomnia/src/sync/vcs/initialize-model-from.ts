import * as models from '../../models';
import { RemoteProject } from '../../models/project';
import { Project } from '../../models/project';
import { Workspace, WorkspaceScopeKeys } from '../../models/workspace';
import { Team } from '../types';
import { BackendProject } from '../types';
/**** ><> ↑ --------- Import dependencies ->  */

export const initializeProjectFromTeam = (team: Team) => models.initModel<RemoteProject>(
  models.project.type,
  {
    _id: `${models.project.prefix}_${team.id}`,
    remoteId: team.id,
    name: team.name,
  }
);
/**** ><> ↑ --------- Initialize project from team function definition ->  */

export const initializeWorkspaceFromBackendProject = (backendProject: BackendProject, project: Project) => models.initModel<Workspace>(
  models.workspace.type,
  {
    _id: backendProject.rootDocumentId,
    name: backendProject.name,
    parentId: project._id,
    scope: WorkspaceScopeKeys.collection,
  }
);
/**** ><> ↑ --------- Initialize workspace from backend project function definition ->  */
