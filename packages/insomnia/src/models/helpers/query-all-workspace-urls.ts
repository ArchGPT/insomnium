import { database as db } from '../../common/database';
import * as models from '../../models';
import { invariant } from '../../utils/invariant';
import { GrpcRequest, type as GrpcRequestType } from '../grpc-request';
import { Request, type as RequestType } from '../request';
/**** ><> ↑ --------- imports ->  */

export const queryAllWorkspaceUrls = async (
  workspaceId: string,
  reqType: typeof RequestType | typeof GrpcRequestType,
  reqId = 'n/a',
): Promise<string[]> => {
/**** ><> ↑ --------- function declaration ->  */
  const workspace = await models.workspace.getById(workspaceId);
  invariant(workspace, `Workspace ${workspaceId} not found`);
  const docs = await db.withDescendants(workspace, reqType) as (Request | GrpcRequest)[];
/**** ><> ↑ --------- fetching workspace and validating ->  */
  const urls = docs
    .filter(
      d =>
        d.type === reqType &&
        d._id !== reqId && // Not current request
        (d.url || ''), // Only ones with non-empty URLs
    )
    .map((r: Request | GrpcRequest) => (r.url || '').trim());
/**** ><> ↑ --------- url filtering and mapping ->  */
  return Array.from(new Set(urls));
};
/**** ><> ↑ --------- return unique urls ->  */
