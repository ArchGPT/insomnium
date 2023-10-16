import { BaseModel } from '../models/index';
import { isWorkspace } from '../models/workspace';
import { guard } from '../utils/guard';
import { database as db } from './database';
import { DEFAULT_PROJECT_ID } from '../models/project';
import { importResourcesToNewWorkspace } from './importResourcesToNewWorkspace';
import { ResourceCache } from './import';

export async function importResourcesToProject({ projectId = DEFAULT_PROJECT_ID, _resources }: { projectId?: string; _resources?: BaseModel[] }) {

  const resources = _resources || ResourceCache!.resources;
  guard(resources, 'No resources to import');

  const bufferId = await db.bufferChanges();
  if (!resources.find(isWorkspace)) {
    await importResourcesToNewWorkspace(projectId, resources);
    return { resources };
  }
  const r = await Promise.all(resources.filter(isWorkspace)
    .map(resource => importResourcesToNewWorkspace(projectId, resources, resource)));

  await db.flushChanges(bufferId);
  return { resources: r.flat() };
}
