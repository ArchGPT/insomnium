import { useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { ChangeBufferEvent, database } from '../../common/database';
import { BaseModel } from '../../models';
import { WorkspaceLoaderData } from '../routes/workspace';
/**** ><> ↑ --------- Importing necessary modules and packages ->  */
// We use this hook to determine if the active request has been updated from the system (not the user typing)
// For example, by pulling a new version from the remote, switching branches, etc.
export function useActiveRequestSyncVCSVersion() {
  const [version, setVersion] = useState(0);
  const { requestId } = useParams() as { requestId: string };

  useEffect(() => {
    const isRequestUpdatedFromSync = (changes: ChangeBufferEvent<BaseModel>[]) => changes.find(([, doc, fromSync]) => requestId === doc._id && fromSync);
    database.onChange(changes => isRequestUpdatedFromSync(changes) && setVersion(v => v + 1));
  }, [requestId]);

  return version;
}
/**** ><> ↑ --------- Creating a hook to check if an active request has been updated from the system ->  */

// We use this hook to determine if the active active api-spec has been updated from the system (not the user typing)
// For example, by pulling a new version from the remote, switching branches, etc.
export function useActiveApiSpecSyncVCSVersion() {
  const [version, setVersion] = useState(0);
  const {
    activeApiSpec,
  } = useRouteLoaderData(':workspaceId') as WorkspaceLoaderData;
  useEffect(() => {
    const isRequestUpdatedFromSync = (changes: ChangeBufferEvent<BaseModel>[]) => changes.find(([, doc, fromSync]) => activeApiSpec?._id === doc._id && fromSync);
    database.onChange(changes => isRequestUpdatedFromSync(changes) && setVersion(v => v + 1));
  }, [activeApiSpec?._id]);

  return version;
}
/**** ><> ↑ --------- Creating a hook to check if an active API spec has been updated from the system ->  */

// We use this hook to determine if the active workspace has been updated from the Git VCS
// For example, by pulling a new version from the remote, switching branches, etc.
export function useGitVCSVersion() {
  const {
    activeWorkspaceMeta,
  } = useRouteLoaderData(':workspaceId') as WorkspaceLoaderData;
  return ((activeWorkspaceMeta?.cachedGitLastCommitTime + '') + activeWorkspaceMeta?.cachedGitRepositoryBranch) + '';
}
/**** ><> ↑ --------- Creating a hook to check if active workspace has been updated from Git VCS ->  */
