import type { RequestHeader } from '../../models/request';
/**** ><> ↑ --------- Import statements ->  */

export function getBasicAuthHeader(
  username?: string | null,
  password?: string | null,
  encoding = 'utf8',
) {
/**** ><> ↑ --------- Function declaration - getBasicAuthHeader ->  */
  const name = 'Authorization';
  const header = `${username || ''}:${password || ''}`;
  // @ts-expect-error -- TSCONVERSION appears to be a genuine error
  const authString = Buffer.from(header, encoding).toString('base64');
  const value = `Basic ${authString}`;
/**** ><> ↑ --------- Variable declarations and value assignments ->  */
  const requestHeader: RequestHeader = {
    name,
    value,
  };
/**** ><> ↑ --------- Initialing requestHeader object ->  */
  return requestHeader;
}
/**** ><> ↑ --------- Returning requestHeader object ->  */
