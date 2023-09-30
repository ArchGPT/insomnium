import fs from 'fs';

import * as models from '../../models/index';
import type { ResponseHeader } from '../../models/response';

/**** ><> ↑ --------- Import statements ->  */
interface MaybeResponse {
  parentId?: string;
  statusCode?: number;
  statusMessage?: string;
  bytesRead?: number;
  bytesContent?: number;
  bodyPath?: string;
  elapsedTime?: number;
  headers?: ResponseHeader[];
}
/**** ><> ↑ --------- Interface definition: MaybeResponse ->  */

export function init(response?: MaybeResponse) {
  if (!response) {
    throw new Error('contexts.response initialized without response');
  }

/**** ><> ↑ --------- Function export & initialization ->  */
  return {
    response: {
      // TODO: Make this work. Right now it doesn't because _id is
      // not generated in network.js
      // getId () {
      //   return response.parentId;
      // },

      getRequestId() {
        return response.parentId || '';
      },

      getStatusCode() {
        return response.statusCode || 0;
      },
/**** ><> ↑ --------- Subset: getStatusCode ->  */

      getStatusMessage() {
        return response.statusMessage || '';
      },
/**** ><> ↑ --------- Subset: getStatusMessage ->  */

      getBytesRead() {
        return response.bytesRead || 0;
      },
/**** ><> ↑ --------- Subset: getBytesRead ->  */

      getTime() {
        return response.elapsedTime || 0;
      },
/**** ><> ↑ --------- Subset: getTime ->  */

      getBody() {
        return models.response.getBodyBuffer(response);
      },
/**** ><> ↑ --------- Subset: getBody ->  */

      getBodyStream() {
        return models.response.getBodyStream(response);
      },
/**** ><> ↑ --------- Subset: getBodyStream ->  */

      setBody(body: Buffer) {
        // Should never happen but just in case it does...
        if (!response.bodyPath) {
          throw new Error('Could not set body without existing body path');
        }

        fs.writeFileSync(response.bodyPath, body);
        response.bytesContent = body.length;
      },
/**** ><> ↑ --------- Subset: setBody ->  */

      getHeader(name: string): string | string[] | null {
        const headers = response.headers || [];
        const matchedHeaders = headers.filter(h => h.name.toLowerCase() === name.toLowerCase());

        if (matchedHeaders.length > 1) {
          return matchedHeaders.map(h => h.value);
        } else if (matchedHeaders.length === 1) {
          return matchedHeaders[0].value;
        } else {
          return null;
        }
      },
/**** ><> ↑ --------- Subset: getHeader ->  */

      getHeaders() {
        return response.headers?.map(h => ({
          name: h.name,
          value: h.value,
        }));
      },
/**** ><> ↑ --------- Subset: getHeaders ->  */

      hasHeader(name: string) {
        return this.getHeader(name) !== null;
      },
    },
  };
}
/**** ><> ↑ --------- Response object definition ->  */
/**** ><> ↑ --------- Subset: hasHeader ->  */
