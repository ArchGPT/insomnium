import { v4 } from 'uuid';

import { getApiBaseURL, getAppWebsiteBaseURL, getGitHubGraphQLApiURL } from '../../common/constants';

export const GITHUB_TOKEN_STORAGE_KEY = 'github-oauth-token';
export const GITHUB_GRAPHQL_API_URL = getGitHubGraphQLApiURL();
const getOauthPageURL = () => getAppWebsiteBaseURL() + '/oauth/github';
/**** ><> ↑ --------- Importing modules and declaring constants ->  */

/**
 * This cache stores the states that are generated for the OAuth flow.
 * This is used to check if a command to exchange a code for a token has been initiated by the app or not.
 * More info https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
 */
const statesCache = new Set<string>();
/**** ><> ↑ --------- Set instantiation for cache storage ->  */

export function generateAuthorizationUrl() {
  const state = v4();
  const scopes = ['repo', 'read:user', 'user:email'];
  const scope = scopes.join(' ');

  const url = new URL(getOauthPageURL());

  statesCache.add(state);

  url.search = new URLSearchParams({
    scope,
    state,
  }).toString();

  return url.toString();
}
/**** ><> ↑ --------- Function to generate an authorization URL ->  */

export async function exchangeCodeForToken({
  code,
  state,
}: {
  code: string;
  state: string;
}) {
  if (!statesCache.has(state)) {
    throw new Error(
      'Invalid state parameter. It looks like the authorization flow was not initiated by the app.'
    );
  }

  return window.main.axiosRequest({
    url: getApiBaseURL() + '/v1/oauth/github',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      code,
    },
  }).then(result => {
    statesCache.delete(state);
    setAccessToken(result.data.access_token);
  });
}
/**** ><> ↑ --------- Function to exchange code for token ->  */

export function getAccessToken() {
  return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string) {
  return localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token);
}

export function signOut() {
  localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
}
/**** ><> ↑ --------- Functions to get, set, and sign out access token ->  */
