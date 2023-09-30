import { jest } from '@jest/globals';
/**** ><> ↑ --------- Importing required module ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
/**** ><> ↑ --------- Warning comment ->  */
module.exports = {
  shallowClone: jest.fn(),
};
/**** ><> ↑ --------- Module export ->  */
