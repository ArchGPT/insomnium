import {
  Authentication,
  Body,
  Converter,
  Header,
  ImportRequest,
  Parameter,
} from "../entities";

export const id = "hoppscotch-2";
export const name = "Hoppscotch v2";
export const description = "Hoppscotch v2 format";

interface HoppscotchHeader {
  active: boolean;
  key: string;
  value: string;
}

interface HoppscotchAuth {
  authType: "none" | "inherit" | "basic" | "bearer" | "oauth-2" | "api-key";
  authActive: boolean;
  username?: string; // HoppRESTAuthBasic
  password?: string; // HoppRESTAuthBasic
  token?: string; // HoppRESTAuthBearer or HoppRESTAuthOAuth2
  oidcDiscoveryURL?: string; // HoppRESTAuthOAuth2
  authURL?: string; // HoppRESTAuthOAuth2
  accessTokenURL?: string; // HoppRESTAuthOAuth2
  clientID?: string; // HoppRESTAuthOAuth2
  scope?: string; // HoppRESTAuthOAuth2
  key?: string; // HoppRESTAuthAPIKey
  value?: string; // HoppRESTAuthAPIKey
  addTo?: "Headers" | "Query params"; // HoppRESTAuthAPIKey
}

interface HoppscotchRequestFormData {
  key: string;
  active: boolean;
  value: string | Blob;
  isFile: boolean;
}

interface HoppscotchRequestBody {
  contentType:
    | "application/json"
    | "application/ld+json"
    | "application/hal+json"
    | "application/vnd.api+json"
    | "application/xml"
    | "application/x-www-form-urlencoded"
    | "text/html"
    | "text/plain";
  body: string | HoppscotchRequestFormData[] | null | undefined;
}

interface HoppscotchRequestParam {
  active: boolean;
  key: string;
  value: string;
}

interface HoppscotchRequest {
  v: 1;
  name: string;
  auth: HoppscotchAuth;
  method: string;
  body: HoppscotchRequestBody;
  headers: HoppscotchHeader[];
  params: HoppscotchRequestParam[];
  endpoint: string;
  preRequestScript: string;
  testScript: string;
}

interface HoppscotchInheritableFolderProps {
  auth: HoppscotchAuth;
  headers: HoppscotchHeader[];
}

interface HoppscotchFolder {
  v: 2;
  headers: HoppscotchHeader[];
  auth: HoppscotchAuth;
  name: string;
  requests: HoppscotchRequest[];
  folders: HoppscotchFolder[];
}

const HoppscotchFolderIdMap = new WeakMap<HoppscotchFolder, string>();
const HoppscotchInheritableFolderPropsMap = new WeakMap<
  HoppscotchFolder,
  HoppscotchInheritableFolderProps
>();

let counter = 100_000;

const composeUid = (prefix: string): string => {
  counter++;
  return `__${prefix}_${counter.toString(36).slice(-5)}__`;
};

const replaceHoppscotchTokens = (input: string | undefined): string => {
  return typeof input === "string"
    ? input.replace(/<<(.+?)>>/g, "{{ _.$1 }}")
    : "";
};

const importHoppscotchHeaders = (headers: HoppscotchHeader[]): Header[] => {
  return headers.map((header) => ({
    name: replaceHoppscotchTokens(header.key),
    value: replaceHoppscotchTokens(header.value),
    disabled: !header.active,
  }));
};

const importHoppscotchAuth = (auth: HoppscotchAuth): Authentication => {
  switch (auth.authType) {
    case "basic":
      return {
        type: "basic",
        username: replaceHoppscotchTokens(auth.username),
        password: replaceHoppscotchTokens(auth.password),
      };
    case "api-key": {
      return {
        type: "apikey",
        key: auth.key,
        value: auth.value,
        addTo: auth.addTo === "Headers" ? "header" : "queryParams", // Only Headers and Query Params in current Hoppscotch format
      };
    }
    case "oauth-2":
      return {
        type: "oauth2",
        token: auth.token,
        accessTokenUrl: replaceHoppscotchTokens(auth.accessTokenURL),
        authorizationUrl: replaceHoppscotchTokens(auth.authURL),
        clientId: replaceHoppscotchTokens(auth.clientID),
        scope: replaceHoppscotchTokens(auth.scope),
      };
    case "bearer":
      return {
        type: "bearer",
        token: replaceHoppscotchTokens(auth.token),
      };
    case "none":
    case "inherit":
    default:
      return {
        disabled: true,
      };
  }
};

const importHoppscotchParams = (
  params: HoppscotchRequestParam[]
): Parameter[] => {
  return params.map((param) => ({
    disabled: !param.active,
    name: replaceHoppscotchTokens(param.key),
    value: replaceHoppscotchTokens(param.value),
  }));
};

const importHoppscotchBody = (body: HoppscotchRequestBody): Body => {
  switch (body.contentType) {
    case "application/x-www-form-urlencoded":
      if (typeof body.body === "string") {
        const params = body.body
          .split("\n")
          ?.map((line) => {
            const matches = /(^\w+?):[ "]*(.+?)[ "]*$/.exec(line);

            if (!matches?.[1] || !matches?.[2]) return null;

            return {
              name: replaceHoppscotchTokens(matches?.[1]),
              value: replaceHoppscotchTokens(matches?.[2]),
            };
          })
          .filter(Boolean) as Parameter[];

        return {
          mimeType: body.contentType,
          params: params ?? null,
        };
      }
    default:
      return {
        mimeType: body.contentType,
        text: replaceHoppscotchTokens(body.body as string),
      };
  }
};

const importHoppscotchRequest = (
  request: HoppscotchRequest,
  parent: HoppscotchFolder
): ImportRequest => {
  const inheritedProps = HoppscotchInheritableFolderPropsMap.get(parent);
  const { headers, auth } = inheritedProps
    ? mergeInheritedFolderProps(request, inheritedProps)
    : { headers: request.headers, auth: request.auth };
  const _id = composeUid("REQ");

  return {
    _id,
    _type: "request",
    name: request.name ?? `Imported request ${_id}`,
    method: request.method,
    body: importHoppscotchBody(request.body),
    url: replaceHoppscotchTokens(request.endpoint),
    parentId: HoppscotchFolderIdMap.get(parent),
    authentication: importHoppscotchAuth(auth),
    headers: importHoppscotchHeaders(headers),
    parameters: importHoppscotchParams(request.params),
  };
};

const importHoppscotchFolder = (
  current: HoppscotchFolder,
  parent: HoppscotchFolder
): ImportRequest => {
  if (!parent?.name) {
    const _id = composeUid("WRK");
    HoppscotchFolderIdMap.set(current, _id);
    HoppscotchInheritableFolderPropsMap.set(current, {
      headers: current.headers,
      auth: current.auth,
    });

    return {
      _id,
      _type: "workspace",
      name: current.name ?? `Imported Folder ${_id}`,
      parentId: null,
    };
  }

  const _id = composeUid("GRP");
  HoppscotchFolderIdMap.set(current, _id);
  setInheritedFolderProps(current, parent);

  return {
    _id,
    _type: "request_group",
    name: current.name || "",
    environment: {},
    parentId: HoppscotchFolderIdMap.get(parent) ?? "__WORKSPACE_ID__",
  };
};

const mergeInheritedFolderProps = (
  childProps: HoppscotchInheritableFolderProps,
  parentProps: HoppscotchInheritableFolderProps
): HoppscotchInheritableFolderProps => {
  const headers = [...childProps.headers] as HoppscotchHeader[];

  for (const parentHeader of parentProps.headers) {
    if (!headers.find((v) => v.key === parentHeader.key)) {
      headers.push(parentHeader);
    }
  }

  const auth =
    childProps.auth.authType === "inherit"
      ? { ...parentProps.auth }
      : childProps.auth;

  return {
    auth,
    headers,
  };
};

const setInheritedFolderProps = (
  child: HoppscotchFolder,
  parent: HoppscotchFolder
) => {
  const childProps = { auth: child.auth, headers: child.headers };
  const parentProps = HoppscotchInheritableFolderPropsMap.get(parent);
  const mergedProps = mergeInheritedFolderProps(
    childProps,
    parentProps ?? childProps
  );
  HoppscotchInheritableFolderPropsMap.set(child, mergedProps);
};

const importHoppscotchFolderRecursive = (
  current: HoppscotchFolder,
  items: ImportRequest[],
  parent: HoppscotchFolder
): ImportRequest[] => {
  items.push(importHoppscotchFolder(current, parent));

  for (const request of current.requests) {
    try {
      items.push(importHoppscotchRequest(request, current));
    } catch (error) {
      console.error("Import request failed", { request });
    }
  }

  for (const folder of current.folders) {
    importHoppscotchFolderRecursive(folder, items, current);
  }

  return items;
};

const isHoppscotchFolder = (obj: HoppscotchFolder, version = 2) => {
  if (typeof obj?.name !== "string") return false;
  if (typeof obj?.headers !== "object") return false;
  if (typeof obj?.auth === "undefined") return false;
  if (typeof obj?.requests !== "object") return false;
  if (typeof obj?.folders !== "object") return false;
  if (obj?.v !== version) return false;

  return true;
};

export const convert: Converter = (rawData) => {
  let data;

  try {
    data = JSON.parse(rawData) as HoppscotchFolder;
  } catch (error) {
    return null;
  }

  if (!isHoppscotchFolder(data)) {
    // Early return if it's not the required format
    return null;
  }

  return importHoppscotchFolderRecursive(
    data,
    [] as ImportRequest[],
    {} as HoppscotchFolder
  );
};
