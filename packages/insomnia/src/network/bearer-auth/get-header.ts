import type { RequestHeader } from '../../models/request';
/**** ><> ↑ --------- Import statements ->  */

export function getBearerAuthHeader(token: string, prefix: string) {
/**** ><> ↑ --------- Function signature ->  */
  const name = 'Authorization';
  const value = `${prefix || 'Bearer'} ${token}`;
/**** ><> ↑ --------- Internal constant declarations ->  */
  const requestHeader: RequestHeader = {
    name,
    value,
  };
/**** ><> ↑ --------- Creating RequestHeader object ->  */
  return requestHeader;
/**** ><> ↑ --------- Returning the RequestHeader object ->  */
}
/**** ><> ↑ --------- End of function ->  */
