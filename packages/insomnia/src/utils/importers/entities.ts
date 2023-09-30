// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a temporary hold-me-over while we get the types into better condition
export type UNKNOWN = any;

export interface UNKNOWN_OBJ {
  [key: string]: UNKNOWN;
}

export interface Comment {
  comment?: UNKNOWN;
}
/**** ><> ↑ --------- UNKNOWN type placeholder and related interfaces ->  */

export type Variable = `{{ ${string} }}`;
/**** ><> ↑ --------- Defines Variable type ->  */

export interface Authentication extends Comment {
  authorizationUrl?: string;
  accessTokenUrl?: string;
  clientId?: string;
  clientSecret?: Variable;
  scope?: string;
  type?: 'basic' | 'oauth2';
  grantType?: 'authorization_code' | 'password' | 'client_credentials';
  disabled?: boolean;
  username?: string;
  password?: string;
}
/**** ><> ↑ --------- Authentication interface ->  */

export interface Parameter extends Comment {
  name: string;
  value?: string;
  filename?: string;
  fileName?: string;
  disabled?: boolean;
  type?: 'file' | string;
}
/**** ><> ↑ --------- Parameter interface ->  */

export type Body =
  | string
  | {
      mimeType?: string;
      text?: string;
      params?: Parameter[];
    };
/**** ><> ↑ --------- Body type ->  */

export interface Cookie {
  name: string;
  value: string;
}
/**** ><> ↑ --------- Cookie interface ->  */

export interface Header extends Comment {
  name: 'Cookie' | 'Content-Type' | string;
  disabled?: boolean;
  value: UNKNOWN;
}
/**** ><> ↑ --------- Header interface ->  */

export interface PostData {
  params?: Parameter[];
  mimeType?: string;
  text?: string;
}
/**** ><> ↑ --------- PostData interface ->  */

export interface QueryString extends Comment {
  name: string;
}
/**** ><> ↑ --------- QueryString interface ->  */

export type ImportRequestType =
  | 'environment'
  | 'request'
  | 'request_group'
  | 'workspace';
/**** ><> ↑ --------- ImportRequestType type ->  */

export interface ImportRequest<T extends {} = {}> extends Comment {
  _id?: string;
  _type?: ImportRequestType;
  authentication?: Authentication;
  body?: Body;
  cookies?: Cookie[];
  environment?: UNKNOWN_OBJ;
  headers?: Header[];
  httpVersion?: string;
  method?: string;
  name?: string;
  data?: T;
  description?: string;
  parameters?: Parameter[];
  parentId?: string | null;
  postData?: PostData;
  variable?: UNKNOWN;
  queryString?: QueryString[];
  url?: string;
}
/**** ><> ↑ --------- ImportRequest interface ->  */

export type Converter<T extends {} = {}> = (
  rawData: string
) => ImportRequest<T>[] | Promise<ImportRequest<T>[] | null> | null;
/**** ><> ↑ --------- Converter type ->  */

export interface Importer {
  id: string;
  name: string;
  description: string;
  convert: Converter;
}
/**** ><> ↑ --------- Importer interface ->  */
