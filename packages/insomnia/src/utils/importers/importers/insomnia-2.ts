import { Converter, ImportRequest } from '../entities';
import { Insomnia1Data } from './insomnia-1';
/**** ><> ↑ --------- Import statements ->  */

export const id = 'insomnia-2';
export const name = 'Insomnium v2';
export const description = 'Insomnium export format 2';

export interface Insomnia2Data extends Omit<Insomnia1Data, '__export_format'> {
  __export_format: 2;
  resources: ImportRequest[];
}
/**** ><> ↑ --------- Constant and interface exports ->  */

export const convert: Converter = rawData => {
  let data: Insomnia2Data | null = null;

  try {
    data = JSON.parse(rawData) as Insomnia2Data;
  } catch (error) {
    return null;
  }

/**** ><> ↑ --------- Source code to parse raw JSON data ->  */
  if (data.__export_format !== 2) {
    // Exit early if it's not the legacy format
    return null;
  }
/**** ><> ↑ --------- Check export format ->  */

  // The only difference between 2 and 3 is the request body object
  for (const resource of data.resources) {
    if (resource._type !== 'request') {
      continue;
    }

    // Convert old String request bodies to new (HAR) schema
    const contentTypeHeader = resource.headers?.find(
      ({ name }) => name.toLowerCase() === 'content-type',
    );

    const mimeType = contentTypeHeader?.value.split(';')[0] ?? '';
    resource.body = {
      mimeType,
      text: resource.body as string,
    };
  }
/**** ><> ↑ --------- Source code to process requests and convert request bodies ->  */

  return data.resources;
};
/**** ><> ↑ --------- Return processed requests ->  */
