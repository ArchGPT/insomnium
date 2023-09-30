import { jest } from '@jest/globals';

import * as modalsOriginal from '../index';

/**** ><> ↑ --------- Imports */
// eslint-disable-next-line filenames/match-exported
const modals = jest.requireActual('../index') as typeof modalsOriginal;

/**** ><> ↑ --------- Disabling eslint rule and requiring actual module */
modals.showError = jest.fn();
modals.showAlert = jest.fn();
modals.showPrompt = jest.fn();
modals.showModal = jest.fn();
/**** ><> ↑ --------- Mocking module methods */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
module.exports = modals;
/**** ><> ↑ --------- Export Warning and module export */
