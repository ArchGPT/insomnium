import crypto from 'crypto';

import { database as db } from '../common/database';
import type { BaseModel } from './index';
/**** ><> ↑ --------- Importing required modules ->  */

export const name = 'Cookie Jar';

export const type = 'CookieJar';

export const prefix = 'jar';

export const canDuplicate = true;

export const canSync = false;

/**** ><> ↑ --------- Defining constants ->  */
export interface Cookie {
  id: string;
  key: string;
  value: string;
  expires: Date | string | number | null;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  extensions?: any[];
  creation?: Date;
  creationIndex?: number;
  hostOnly?: boolean;
  pathIsDefault?: boolean;
  lastAccessed?: Date;
}
/**** ><> ↑ --------- Defining the Cookie interface ->  */

export interface BaseCookieJar {
  name: string;
  cookies: Cookie[];
}
/**** ><> ↑ --------- Defining the BaseCookieJar interface ->  */

export type CookieJar = BaseModel & BaseCookieJar;

/**** ><> ↑ --------- Defining the CookieJar type ->  */
export const isCookieJar = (model: Pick<BaseModel, 'type'>): model is CookieJar => (
  model.type === type
);
/**** ><> ↑ --------- Function to determine if model is a CookieJar ->  */

export function init() {
  return {
    name: 'Default Jar',
    cookies: [],
  };
}
/**** ><> ↑ --------- Initialization function ->  */

export function migrate(doc: CookieJar) {
  try {
    doc = migrateCookieId(doc);
    return doc;
  } catch (e) {
    console.log('[db] Error during cookie jar migration', e);
    throw e;
  }
}
/**** ><> ↑ --------- Function to migrate CookieJar ->  */

export async function create(patch: Partial<CookieJar>) {
  if (!patch.parentId) {
    throw new Error(`New CookieJar missing \`parentId\`: ${JSON.stringify(patch)}`);
  }

  return db.docCreate<CookieJar>(type, patch);
}
/**** ><> ↑ --------- Function to create new CookieJar ->  */

export async function getOrCreateForParentId(parentId: string) {
  const cookieJars = await db.find<CookieJar>(type, { parentId });

  if (cookieJars.length === 0) {
    return create({
      parentId,
      // Deterministic ID. It helps reduce sync complexity since we won't have to
      // de-duplicate environments.
      _id: `${prefix}_${crypto.createHash('sha1').update(parentId).digest('hex')}`,
    });
  } else {
    return cookieJars[0];
  }
}
/**** ><> ↑ --------- Function to get or create CookieJar for a parent ID ->  */

export async function all() {
  return db.all<BaseModel>(type);
}
/**** ><> ↑ --------- Function to fetch all models ->  */

export async function getById(id: string): Promise<CookieJar | null> {
  return db.get(type, id);
}
/**** ><> ↑ --------- Function to get CookieJar by ID ->  */

export async function update(cookieJar: CookieJar, patch: Partial<CookieJar> = {}) {
  return db.docUpdate(cookieJar, patch);
}
/**** ><> ↑ --------- Function to update CookieJar ->  */

/** Ensure every cookie has an ID property */
function migrateCookieId(cookieJar: CookieJar) {
  for (const cookie of cookieJar.cookies) {
    if (!cookie.id) {
      cookie.id = Math.random().toString().replace('0.', '');
    }
  }

  return cookieJar;
}
/**** ><> ↑ --------- Function to ensure every cookie has an ID ->  */
