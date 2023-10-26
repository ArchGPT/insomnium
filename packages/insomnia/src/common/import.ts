import { readFile } from 'fs/promises';

import { ApiSpec, isApiSpec } from '../models/api-spec';
import { CookieJar, isCookieJar } from '../models/cookie-jar';
import { BaseEnvironment, Environment, isEnvironment } from '../models/environment';
import { GrpcRequest, isGrpcRequest } from '../models/grpc-request';
import { BaseModel, getModel } from '../models/index';
import * as models from '../models/index';
import { isRequest, Request } from '../models/request';
import { isUnitTest, UnitTest } from '../models/unit-test';
import { isUnitTestSuite, UnitTestSuite } from '../models/unit-test-suite';
import {
  isWebSocketRequest,
  WebSocketRequest,
} from '../models/websocket-request';
import { isWorkspace, Workspace } from '../models/workspace';
import { convert, InsomniaImporter } from '../utils/importers/convert';
import { guard } from '../utils/guard';
import { database as db } from './database';
import { generateId } from './misc';
import { importResourcesToProject } from './importResourcesToProject';
import { getAppVersion } from './constants';

export interface ExportedModel extends BaseModel {
  _type: string;
}

interface ConvertResult {
  type: InsomniaImporter;
  data: {
    resources: ExportedModel[];
  };
}

export const isSubEnvironmentResource = (environment: Environment) => {
  return !environment.parentId || environment.parentId.startsWith(models.environment.prefix) || environment.parentId.startsWith('__BASE_ENVIRONMENT_ID__');
};

export const isInsomniaV4Import = ({ id }: Pick<InsomniaImporter, 'id'>) =>
  id === 'insomnia-4';

export async function fetchImportContentFromURI({ uri }: { uri: string }) {
  const url = new URL(uri);

  if (url.origin === 'https://github.com') {
    uri = uri
      .replace('https://github.com', 'https://raw.githubusercontent.com')
      .replace('blob/', '');
  }

  if (uri.match(/^(http|https):\/\//)) {
    const response = await fetch(uri);
    const content = await response.text();

    return content;
  } else if (uri.match(/^(file):\/\//)) {
    const path = uri.replace(/^(file):\/\//, '');
    const content = await readFile(path, 'utf8');

    return content;
  } else {
    // Treat everything else as raw text
    const content = decodeURIComponent(uri);

    return content;
  }
}

export interface ScanResult {
  requests?: (Request | WebSocketRequest | GrpcRequest)[];
  workspaces?: Workspace[];
  environments?: BaseEnvironment[];
  apiSpecs?: ApiSpec[];
  cookieJars?: CookieJar[];
  unitTests?: UnitTest[];
  unitTestSuites?: UnitTestSuite[];
  type?: InsomniaImporter;
  errors: string[];
}

export let ResourceCache: {
  content: string;
  resources: BaseModel[];
  type: InsomniaImporter;
} | null = null;

export async function scanResources({
  content,
}: {
  content: string;
}): Promise<ScanResult> {
  let results: ConvertResult | null = null;

  try {
    results = (await convert(content)) as unknown as ConvertResult;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: [err.message],
      };
    }
  }

  if (!results) {
    return {
      errors: ['No resources found to import.'],
    };
  }

  const { type, data } = results;

  const resources = data.resources
    .filter(r => r._type)
    .map(r => {
      const { _type, ...model } = r;
      return { ...model, type: models.MODELS_BY_EXPORT_TYPE[_type].type };
    });

  ResourceCache = {
    resources,
    type,
    content,
  };

  const requests = resources.filter(isRequest);
  const websocketRequests = resources.filter(isWebSocketRequest);
  const grpcRequests = resources.filter(isGrpcRequest);
  const environments = resources.filter(isEnvironment);
  const unitTests = resources.filter(isUnitTest);
  const unitTestSuites = resources.filter(isUnitTestSuite);
  const apiSpecs = resources.filter(isApiSpec);
  const workspaces = resources.filter(isWorkspace);
  const cookieJars = resources.filter(isCookieJar);

  return {
    type,
    unitTests,
    unitTestSuites,
    requests: [...requests, ...websocketRequests, ...grpcRequests],
    workspaces,
    environments,
    apiSpecs,
    cookieJars,
    errors: [],
  };
}

export const importPure = async (json: { resources: BaseModel[] } & any) => {
  const _resources = json.resources;
  // console.log("importPure", json);
  return await importResourcesToProject({ _resources });
};

export const importResourcesToWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
  guard(ResourceCache, 'No resources to import');
  const resources = ResourceCache.resources;
  return await importToWorkspace({ workspaceId, resources });
};

export const importToWorkspaceFromJSON = async ({ workspaceId, json }: { workspaceId: string; json: { resources: BaseModel[] } } & any) => {
  const resources = json.resources;
  return await importToWorkspace({ workspaceId, resources });
};

export const importToWorkspace = async ({ workspaceId, resources }: { workspaceId: string; resources: BaseModel[] }) => {

  const bufferId = await db.bufferChanges();
  const ResourceIdMap = new Map();
  const existingWorkspace = await models.workspace.getById(workspaceId);

  guard(
    existingWorkspace,
    `Could not find workspace with id ${workspaceId}`
  );
  // Map new IDs
  ResourceIdMap.set(workspaceId, existingWorkspace._id);
  ResourceIdMap.set('__WORKSPACE_ID__', existingWorkspace._id);
  const toImport = resources.find(isWorkspace);
  toImport && ResourceIdMap.set(toImport._id, existingWorkspace._id);

  const optionalResources = resources.filter(
    resource =>
      !isWorkspace(resource) &&
      !isApiSpec(resource) &&
      !isCookieJar(resource) &&
      !isEnvironment(resource)
  );

  const baseEnvironment = await models.environment.getOrCreateForParentId(workspaceId);
  guard(baseEnvironment, 'Could not create base environment');

  const subEnvironments = resources.filter(isEnvironment).filter(isSubEnvironmentResource) || [];

  for (const environment of subEnvironments) {
    const model = getModel(environment.type);
    model && ResourceIdMap.set(environment._id, generateId(model.prefix));

    await db.docCreate(environment.type, {
      ...environment,
      _id: ResourceIdMap.get(environment._id),
      parentId: baseEnvironment._id,
    });
  }

  // Create new ids for each resource below optionalResources
  for (const resource of optionalResources) {
    const model = getModel(resource.type);
    model && ResourceIdMap.set(resource._id, generateId(model.prefix));
  }

  // Preserve optionalResource relationships
  for (const resource of optionalResources) {
    const model = getModel(resource.type);
    if (model) {
      // Make sure we point to the new proto file
      if (isGrpcRequest(resource)) {
        await db.docCreate(model.type, {
          ...resource,
          _id: ResourceIdMap.get(resource._id),
          protoFileId: ResourceIdMap.get(resource.protoFileId),
          parentId: ResourceIdMap.get(resource.parentId),
        });

        // Make sure we point unit test to the new request
      } else if (isUnitTest(resource)) {
        await db.docCreate(model.type, {
          ...resource,
          _id: ResourceIdMap.get(resource._id),
          requestId: ResourceIdMap.get(resource.requestId),
          parentId: ResourceIdMap.get(resource.parentId),
        });
      } else {
        await db.docCreate(model.type, {
          ...resource,
          _id: ResourceIdMap.get(resource._id),
          parentId: ResourceIdMap.get(resource.parentId),
        });
      }
    }
  }

  await db.flushChanges(bufferId);

  return {
    resources: resources.map(r => ({
      ...r,
      _id: ResourceIdMap.get(r._id),
      parentId: ResourceIdMap.get(r.parentId),
    })),
    workspace: existingWorkspace,
  };
};
export const isApiSpecImport = ({ id }: Pick<InsomniaImporter, 'id'>) =>
  id === 'openapi3' || id === 'swagger2';

export const dummyStartingWorkspace = () => {
  const currentUnixTime = Date.now();
  const oneSec = 1000;
  const wId = generateId(models.workspace.prefix);
  const rId = generateId(models.request.prefix);
  const eId = generateId(models.environment.prefix);
  const jId = generateId(models.cookieJar.prefix);
  return [({
    "_type": "export",
    "__export_format": 4,
    "__export_date": "2023-10-04T20:25:03.318Z",
    "__export_source": "insomnia.desktop.app:v0.1.3",
    "resources": [
      {
        "_id": rId,
        "parentId": wId,
        "modified": currentUnixTime - oneSec * 3,
        "created": currentUnixTime - oneSec * 3,
        "url": "",
        "name": "New Request",
        "description": "",
        "method": "GET",
        "body": {},
        "parameters": [],
        "headers": [{ "name": "User-Agent", "value": "insomnium/" + getAppVersion() }],
        "authentication": {},
        "metaSortKey": -(currentUnixTime - oneSec * 3 - 1),
        "isPrivate": false,
        "settingStoreCookies": true,
        "settingSendCookies": true,
        "settingDisableRenderRequestBody": false,
        "settingEncodeUrl": true,
        "settingRebuildPath": true,
        "settingFollowRedirects": "global",
        "type": "Request",
      },
      {
        "_id": wId,
        "parentId": null,
        "modified": currentUnixTime - oneSec * 2,
        "created": currentUnixTime - oneSec * 2,
        "name": "My Collection",
        "description": "",
        "scope": "collection",
        // "_type": "workspace",
        "type": "Workspace",
        // hmm where is the fn for import field transfromation from Insomnia
      },
      {
        "_id": eId,
        "parentId": wId,
        "modified": currentUnixTime - oneSec * 1,
        "created": currentUnixTime - oneSec * 1,
        "name": "Base Environment",
        "data": {},
        "dataPropertyOrder": null,
        "color": null,
        "isPrivate": false,
        "metaSortKey": currentUnixTime - oneSec * 1,
        "type": "Environment",
      },
      {
        "_id": jId,
        "parentId": wId,
        "modified": currentUnixTime,
        "created": currentUnixTime,
        "name": "Default Jar",
        "cookies": [],
        "type": "CookieJar",
      },
    ],
  }), wId, rId];
};
