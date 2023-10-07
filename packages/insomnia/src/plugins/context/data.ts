import * as models from '../../models';
import type { Workspace } from '../../models/workspace';
import { init as dataInit } from './dataInit';

export interface InsomniaExport {
  workspace?: Workspace;
  includePrivate?: boolean;
  format?: 'json' | 'yaml';
}

export type HarExport = Omit<InsomniaExport, 'format'>;

export const getWorkspaces = (activeProjectId?: string) => {
  if (activeProjectId) {
    return models.workspace.findByParentId(activeProjectId);
  } else {
    // This code path was kept in case there was ever a time when the app wouldn't have an active project.
    // In over 5 months of monitoring in production, we never saw this happen.
    // Keeping it for defensive purposes, but it's not clear if it's necessary.
    return models.workspace.all();
  }
};

export const init = dataInit



