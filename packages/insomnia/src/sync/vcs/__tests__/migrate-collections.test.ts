import { createBuilder } from '@develohpanda/fluent-builder';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mocked } from 'jest-mock';

import { globalBeforeEach } from '../../../__jest__/before-each';
import { isLoggedIn as _isLoggedIn } from '../../../account/session';
import { database } from '../../../common/database';
import * as models from '../../../models';
import { backendProjectWithTeamSchema, teamSchema } from '../../__schemas__/type-schemas';
import MemoryDriver from '../../store/drivers/memory-driver';
import { initializeProjectFromTeam } from '../initialize-model-from';
import { migrateCollectionsIntoRemoteProject } from '../migrate-collections';
import { VCS } from '../vcs';
/**** ><> ↑ --------- Importing Required Libraries and modules ->  */

jest.mock('../vcs');
jest.mock('../../../account/session', () => ({
  isLoggedIn: jest.fn(),
}));

const isLoggedIn = mocked(_isLoggedIn);
const newMockedVcs = () => mocked(new VCS(new MemoryDriver()), true);

/**** ><> ↑ --------- Mocking required modules and creating test scenario setup ->  */
const projectWithTeamBuilder = createBuilder(backendProjectWithTeamSchema);
const teamBuilder = createBuilder(teamSchema);
/**** ><> ↑ --------- Initialising schema builders ->  */

describe('migrateCollectionsIntoRemoteProject', () => {
  beforeEach(async () => {
    await globalBeforeEach();
    // Always return logged in
    isLoggedIn.mockReturnValue(true);
    teamBuilder.reset();
    projectWithTeamBuilder.reset();
  });
/**** ><> ↑ --------- Describe block for testing 'migrateCollectionsIntoRemoteProject' function ->  */

  it('exits if not logged in', async () => {
    // Arrange
    isLoggedIn.mockReturnValue(false);
    const vcs = newMockedVcs();

    // Act
    await migrateCollectionsIntoRemoteProject(vcs);

    // Assert
    expect(vcs.hasBackendProjectForRootDocument).not.toHaveBeenCalled();
    expect(vcs.remoteBackendProjectsInAnyTeam).not.toHaveBeenCalled();
  });
/**** ><> ↑ --------- Test case for checking exit condition when not logged in ->  */

  it('does not migrate if all collections are in a remote project already', async () => {
    // Arrange
    const vcs = newMockedVcs();

    const remoteProject = await models.project.create({ remoteId: 'str' });
    const workspaceInRemote = await models.workspace.create({ parentId: remoteProject._id });

    vcs.hasBackendProjectForRootDocument.mockResolvedValue(true); // has local backend project

    // Act
    await migrateCollectionsIntoRemoteProject(vcs);

    // Assert
    expect(vcs.remoteBackendProjectsInAnyTeam).not.toHaveBeenCalled();
    await expect(models.workspace.getById(workspaceInRemote._id)).resolves.toStrictEqual(workspaceInRemote);
  });
/**** ><> ↑ --------- Test case for checking non-migration condition if all collections are in a remote project already ->  */

  it('does not migrate if design documents', async () => {
    // Arrange
    const vcs = newMockedVcs();

    const localProject = await models.project.create();
    const workspaceInLocal = await models.workspace.create({ scope: 'design', parentId: localProject._id });

    vcs.hasBackendProjectForRootDocument.mockResolvedValue(true); // has local backend project

    // Act
    await migrateCollectionsIntoRemoteProject(vcs);

    // Assert
    expect(vcs.remoteBackendProjectsInAnyTeam).not.toHaveBeenCalled();
    await expect(models.workspace.getById(workspaceInLocal._id)).resolves.toStrictEqual(workspaceInLocal);
  });
/**** ><> ↑ --------- Test case for checking no migration occurs for design documents ->  */

  it('does migrate if collection in non-remote project with local backend project - create remote project', async () => {
    // Arrange
    const vcs = newMockedVcs();
    const localProject = await models.project.create();
    const workspaceInLocal = await models.workspace.create({ parentId: localProject._id });

    const team = teamBuilder.build();
    const remoteBackendProjectWithTeam = projectWithTeamBuilder
      .rootDocumentId(workspaceInLocal._id)
      .team(team)
      .build();

    vcs.hasBackendProjectForRootDocument.mockResolvedValue(true); // has local backend project
    vcs.remoteBackendProjectsInAnyTeam.mockResolvedValue([remoteBackendProjectWithTeam]); // has local backend project

    // Act
    await migrateCollectionsIntoRemoteProject(vcs);

    // Assert
    expect(vcs.remoteBackendProjectsInAnyTeam).toHaveBeenCalledTimes(1);
    const createdRemoteProject = await models.project.getByRemoteId(team.id);
    await expect(models.workspace.getById(workspaceInLocal._id)).resolves.toMatchObject({
      ...workspaceInLocal,
      parentId: createdRemoteProject?._id,
    });
  });
/**** ><> ↑ --------- Test case for migration scenario where collection is in non-remote project with local backend project - create remote project ->  */

  it('does migrate if collection in non-remote project with local backend project - use existing remote project', async () => {
    // Arrange
    const vcs = newMockedVcs();
    const localProject = await models.project.create();
    const workspaceInLocal = await models.workspace.create({ parentId: localProject._id });

    const team = teamBuilder.build();
    const existingRemoteProject = await initializeProjectFromTeam(team);
    await database.batchModifyDocs({ upsert: [existingRemoteProject] });

    const remoteProjectWithTeam = projectWithTeamBuilder
      .rootDocumentId(workspaceInLocal._id)
      .team(team)
      .build();

    vcs.hasBackendProjectForRootDocument.mockResolvedValue(true); // has local backend project
    vcs.remoteBackendProjectsInAnyTeam.mockResolvedValue([remoteProjectWithTeam]); // has local backend project

    // Act
    await migrateCollectionsIntoRemoteProject(vcs);

    // Assert
    expect(vcs.remoteBackendProjectsInAnyTeam).toHaveBeenCalledTimes(1);
    await expect(models.workspace.getById(workspaceInLocal._id)).resolves.toMatchObject({
      ...workspaceInLocal,
      parentId: existingRemoteProject?._id,
    });
  });
});
/**** ><> ↑ --------- Test case for migration scenario where collection is in non-remote project with local backend project - use existing remote project ->  */
