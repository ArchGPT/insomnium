import { beforeEach, describe, expect, it } from '@jest/globals';

import { globalBeforeEach } from '../../__jest__/before-each';
import * as models from '../index';

/**** ><> ↑ --------- Importing necessary modules and functions ->  */
describe('create()', () => {
/**** ><> ↑ --------- Description of the test case ->  */
  beforeEach(globalBeforeEach);
/**** ><> ↑ --------- Setting up test preconditions ->  */

  it('fails when missing parentId', async () => {
    expect(() =>
      models.requestMeta.create({
        pinned: true,
      }),
    ).toThrow('New RequestMeta missing `parentId`');
/**** ><> ↑ --------- Test for failure when parentId is missing ->  */
  }); // it('fails when parentId prefix is not that of a Request', async () => {
  //   expect(() => models.requestMeta.create({ parentId: 'greq_123' })).toThrow(
  //     'Expected the parent of RequestMeta to be a Request',
  //   );
  // });
/**** ><> ↑ --------- Commented out test code for parentId prefix ->  */
});
/**** ><> ↑ --------- End of the test case ->  */
