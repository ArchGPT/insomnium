import { ActionFunction } from 'react-router-dom';
import { importResourcesToWorkspace } from '../../common/import';
import { importResourcesToProject } from '../../common/importResourcesToProject';
import * as models from '../../models';
import { DEFAULT_PROJECT_ID } from '../../models/project';
import { guard } from '../../utils/guard';
import { ImportResourcesActionResult } from './import';


export const importResourcesAction: ActionFunction = async ({ request }): Promise<ImportResourcesActionResult> => {
  const formData = await request.formData();

  const organizationId = formData.get('organizationId');
  let projectId = formData.get('projectId');
  const workspaceId = formData.get('workspaceId');

  guard(typeof organizationId === 'string', 'OrganizationId is required.');
  // when importing through insomnia://app/import, projectId is not provided
  if (typeof projectId !== 'string' || !projectId) {
    projectId = DEFAULT_PROJECT_ID;
  }

  const project = await models.project.getById(projectId);
  guard(project, 'Project not found.');
  if (typeof workspaceId === 'string' && workspaceId) {
    await importResourcesToWorkspace({
      workspaceId: workspaceId,
    });
    // TODO: find more elegant way to wait for import to finish
    return { done: true };
  }

  await importResourcesToProject({ projectId: project._id });
  return { done: true };
};
