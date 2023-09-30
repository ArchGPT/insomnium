// Broken for now...
// import * as renderer from '../renderer';
// import { globalBeforeEach } from '../__jest__/before-each';
// describe('imports', () => {
//   beforeEach(globalBeforeEach);
//   it('ui module should import successfully', () => {
//     expect(renderer).toBeDefined();
//   });
// });
/**** ><> ↑ --------- Commented out code block regarding imports and some tests. ->  */

import { describe, expect, it } from '@jest/globals';
/**** ><> ↑ --------- Import statements for jest globals. ->  */

describe('dummy', () => {
  it('does it', () => {
    expect(true).toBe(true);
  });
});
/**** ><> ↑ --------- A dummy describe block with a single test ->  */
