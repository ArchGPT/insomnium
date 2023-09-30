import { describe, expect, it } from '@jest/globals';
import { fail } from 'assert';
/**** ><> ↑ --------- Imports section for test and assertion libraries ->  */

import { convert } from './convert';
/**** ><> ↑ --------- Imports section for the function convert from local module ->  */

describe('Import errors', () => {
  it('fail to find importer', async () => {
    try {
      await convert('foo');
      fail('Should have thrown error');
    } catch (err) {
      expect(err.message).toBe('No importers found for file');
    }
  });
});
/**** ><> ↑ --------- Test suite describing import errors ->  */
