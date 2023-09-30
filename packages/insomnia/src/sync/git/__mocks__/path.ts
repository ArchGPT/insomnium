import { jest } from '@jest/globals';
import pathOriginal from 'path';
/**** ><> ↑ --------- Module imports ->  */

// eslint-disable-next-line filenames/match-exported
const path = jest.requireActual('path') as typeof pathOriginal;
/**** ><> ↑ --------- Import mocking ->  */

const exportObj = { __mockPath, ...path };
/**** ><> ↑ --------- Export object declaration ->  */

function __mockPath(type) {
  const mock = type === 'win32' ? path.win32 : path.posix;

  Object.keys(mock).forEach(k => {
    exportObj[k] = mock[k];
  });
}
/**** ><> ↑ --------- __mockPath function declaration ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
module.exports = exportObj;
/**** ><> ↑ --------- Module export ->  */
