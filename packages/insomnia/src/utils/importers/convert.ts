import { ImportRequest } from './entities';
import { setDefaults } from './utils';
/**** ><> ↑ --------- Import statements ->  */

export interface InsomniaImporter {
  id: string;
  name: string;
  description: string;
}
/**** ><> ↑ --------- InsomniaImporter interface definition ->  */

export interface ConvertResult {
  type: InsomniaImporter;
  data: {
    _type: 'export';
    __export_format: 4;
    __export_date: string;
    __export_source: `insomnia.importers:v${string}`;
    resources: ImportRequest[];
  };
}
/**** ><> ↑ --------- ConvertResult interface definition ->  */

export const convert = async (rawData: string) => {
  const importers = (await import('./importers')).importers;
  for (const importer of importers) {
    const resources = await importer.convert(rawData);

    if (!resources) {
      continue;
    }

    if (resources.length > 0 && resources[0].variable) {
      resources[0].environment = resources[0].variable;
    }
/**** ><> ↑ --------- creating environment from variable if exists ->  */

    const convertedResult = {
      type: {
        id: importer.id,
        name: importer.name,
        description: importer.description,
      },
      data: {
        _type: 'export',
        __export_format: 4,
        __export_date: new Date().toISOString(),
        __export_source: 'insomnia.importers:v0.1.0',
        resources: resources.map(setDefaults) as ImportRequest[],
      },
    };
/**** ><> ↑ --------- preparation of conversion result data ->  */

    return convertedResult;
/**** ><> ↑ --------- returning converted result ->  */
/**** ><> ↑ --------- iteration over importers ->  */
  }

/**** ><> ↑ --------- convert function definition ->  */
  throw new Error('No importers found for file');
};
/**** ><> ↑ --------- throw error if no importers found ->  */
