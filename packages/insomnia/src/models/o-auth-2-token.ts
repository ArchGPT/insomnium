import { database as db } from '../common/database';
import type { BaseModel } from './index';

export type OAuth2Token = BaseModel & BaseOAuth2Token;
/**** ><> ↑ --------- Importing modules and typing ->  */

export const name = 'OAuth 2.0 Token';

export const type = 'OAuth2Token';

export const prefix = 'oa2';

export const canDuplicate = false;

export const canSync = false;

/**** ><> ↑ --------- Constant declarations ->  */
export interface BaseOAuth2Token {
  refreshToken: string;
  accessToken: string;
  identityToken: string;
  expiresAt: number | null;
  // Should be Date.now() if valid
  // Debug
  xResponseId: string | null;
  xError: string | null;
  // Error handling
  error: string;
  errorDescription: string;
  errorUri: string;
}
/**** ><> ↑ --------- OAuth2Token interface declaration ->  */

export const isOAuth2Token = (model: Pick<BaseModel, 'type'>): model is OAuth2Token => (
  model.type === type
);
/**** ><> ↑ --------- Typeguard function ->  */

export function init(): BaseOAuth2Token {
  return {
    refreshToken: '',
    accessToken: '',
    identityToken: '',
    expiresAt: null,
    // Should be Date.now() if valid
    // Debug
    xResponseId: null,
    xError: null,
    // Error handling
    error: '',
    errorDescription: '',
    errorUri: '',
  };
}
/**** ><> ↑ --------- Initialisation function ->  */

export function migrate(doc: OAuth2Token) {
  return doc;
}
/**** ><> ↑ --------- Migrate function ->  */

export function create(patch: Partial<OAuth2Token> = {}) {
  if (!patch.parentId) {
    throw new Error(`New OAuth2Token missing \`parentId\` ${JSON.stringify(patch)}`);
  }

  return db.docCreate<OAuth2Token>(type, patch);
}
/**** ><> ↑ --------- Create function with error handling ->  */

export function update(token: OAuth2Token, patch: Partial<OAuth2Token>) {
  return db.docUpdate(token, patch);
}

export function remove(token: OAuth2Token) {
  return db.remove(token);
}
/**** ><> ↑ --------- Update and remove function definitions ->  */

export function getByParentId(parentId: string) {
  return db.getWhere<OAuth2Token>(type, { parentId });
}
/**** ><> ↑ --------- Function to get OAuth2Token by parentId ->  */

export async function getOrCreateByParentId(parentId: string) {
  let token = await db.getWhere<OAuth2Token>(type, {
    parentId,
  });

  if (!token) {
    token = await create({
      parentId,
    });
  }

  return token;
}
/**** ><> ↑ --------- Function to get or create OAuth2Token by parentId ->  */

export function all() {
  return db.all<OAuth2Token>(type);
}
/**** ><> ↑ --------- Function to get all OAuth2Tokens ->  */
