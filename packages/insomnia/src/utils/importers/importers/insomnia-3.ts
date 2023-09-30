import { Converter } from '../entities';
import { Insomnia2Data } from './insomnia-2';
/**** ><> ↑ --------- Import statements ->  */

export const id = 'insomnia-3';
export const name = 'Insomnium v3';
export const description = 'Insomnium export format 3';

export interface Insomnia3Data extends Omit<Insomnia2Data, '__export_format'> {
  __export_format: 3;
}
/**** ><> ↑ --------- Export constants and type definitions ->  */

export const convert: Converter = rawData => {
  let data: Insomnia3Data | null = null;
/**** ><> ↑ --------- Declaration of `convert` function ->  */

  try {
    data = JSON.parse(rawData) as Insomnia3Data;
  } catch (error) {
    return null;
  }
/**** ><> ↑ --------- Parse input data ->  */

  if (data.__export_format !== 3) {
    // Bail early if it's not the legacy format
    return null;
  }

  // This is the target export format so nothing needs to change
  return data.resources;
};
/**** ><> ↑ --------- Check export format and return resources ->  */
