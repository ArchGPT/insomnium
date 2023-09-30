import { BackendProject, Team } from '../types';

/**** ><> ↑ --------- import statements ->  */
export interface BackendProjectWithTeams extends BackendProject {
  teams: Team[];
}
/**** ><> ↑ --------- interface BackendProjectWithTeams ->  */

export interface BackendProjectWithTeam extends BackendProject {
  team: Team;
}
/**** ><> ↑ --------- interface BackendProjectWithTeam ->  */

export const normalizeBackendProjectTeam = (backend: BackendProjectWithTeams): BackendProjectWithTeam => ({
  id: backend.id,
  name: backend.name,
  rootDocumentId: backend.rootDocumentId,
  // A backend project is guaranteed to exist on exactly one team
  team: backend.teams[0],
});
/**** ><> ↑ --------- function normalizeBackendProjectTeam ->  */
