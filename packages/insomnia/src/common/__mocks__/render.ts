import { jest } from '@jest/globals';

import * as renderOriginal from '../render';
/**** ><> ↑ --------- Importing dependencies ->  */

const _render = jest.requireActual('../render') as typeof renderOriginal;
_render.getRenderedGrpcRequest = jest.fn();
_render.getRenderedGrpcRequestMessage = jest.fn();
/**** ><> ↑ --------- Jest mocks setup ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
module.exports = _render;
/**** ><> ↑ --------- Exporting module ->  */
