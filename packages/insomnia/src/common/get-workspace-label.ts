import { isDesign, Workspace } from '../models/workspace';
import { strings } from './strings';
/**** ><> ↑ --------- Module imports ->  */

export const getWorkspaceLabel = (workspace: Workspace) =>
  isDesign(workspace) ? strings.document : strings.collection;
/**** ><> ↑ --------- Function to get workspace label ->  */
