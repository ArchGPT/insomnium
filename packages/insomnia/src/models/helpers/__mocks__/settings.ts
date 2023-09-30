import { jest } from '@jest/globals';

import * as settingsOriginal from '../settings';
/**** ><> ↑ --------- Importing libraries and modules ->  */

const actual = jest.requireActual('../settings') as typeof settingsOriginal;

actual.getConfigSettings = jest.fn();
/**** ><> ↑ --------- Setting up actual configurations using jest ->  */

module.exports = actual;
/**** ><> ↑ --------- Exporting the modified module ->  */
