import { Schema } from '@develohpanda/fluent-builder';
import clone from 'clone';

import { BaseModel, environment, gitRepository, grpcRequest, request, requestGroup, workspace } from '..';
import { Environment } from '../environment';
import { GitRepository } from '../git-repository';
import { GrpcRequest } from '../grpc-request';
import { Request } from '../request';
import { RequestGroup } from '../request-group';
import { Workspace } from '../workspace';
/**** ><> ↑ --------- Importing libraries and models ->  */

// move into fluent-builder
const toSchema = <T>(obj: T): Schema<T> => {
  const cloned = clone(obj);
  const output: Partial<Schema<T>> = {};

    // @ts-expect-error -- mapping unsoundness
  Object.keys(cloned).forEach(key => {
    // @ts-expect-error -- mapping unsoundness
    output[key] = () => cloned[key];
  });

  return output as Schema<T>;
};
/**** ><> ↑ --------- Function to clone an object and return partial schema ->  */

export const baseModelSchema: Schema<BaseModel> = {
  _id: () => 'id',
  created: () => 1234,
  isPrivate: () => false,
  modified: () => 5678,
  name: () => 'name',
  parentId: () => '',
  type: () => 'base',
};
/**** ><> ↑ --------- Base model schema ->  */

export const workspaceModelSchema: Schema<Workspace> = {
  ...baseModelSchema,
  ...toSchema(workspace.init()),
  certificates: () => undefined,
  type: () => workspace.type,
};
/**** ><> ↑ --------- Workspace model schema ->  */

export const requestModelSchema: Schema<Request> = {
  ...baseModelSchema,
  ...toSchema(request.init()),
  type: () => request.type,
};
/**** ><> ↑ --------- Request model schema ->  */

export const grpcRequestModelSchema: Schema<GrpcRequest> = {
  ...baseModelSchema,
  ...toSchema(grpcRequest.init()),
  type: () => grpcRequest.type,
};
/**** ><> ↑ --------- GRPC request model schema ->  */

export const requestGroupModelSchema: Schema<RequestGroup> = {
  ...baseModelSchema,
  ...toSchema(requestGroup.init()),
  type: () => requestGroup.type,
};
/**** ><> ↑ --------- Request group model schema ->  */

export const gitRepositorySchema: Schema<GitRepository> = {
  ...baseModelSchema,
  type: () => gitRepository.type,
  author: () => ({ name: '', email: '' }),
  credentials: () => null,
  uri: () => '',
  needsFullClone: () => false,
  uriNeedsMigration: () => true,
};
/**** ><> ↑ --------- Git repository schema ->  */

export const environmentModelSchema: Schema<Environment> = {
  ...baseModelSchema,
  ...toSchema(environment.init()),
  type: () => environment.type,
};
/**** ><> ↑ --------- Environment model schema ->  */
