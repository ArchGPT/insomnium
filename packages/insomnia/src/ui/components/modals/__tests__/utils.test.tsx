import { describe, expect, it } from '@jest/globals';

import { wrapToIndex } from '../utils';
/**** ><> ↑ --------- Import statements -> This section just imports necessary functions/modules that are used in the subsequent code. These lines will be called first when the program starts. */

describe('wrapToIndex', () => {
  it.each([
    { index: 0, maxCount: 4, result: 0 },
    { index: 1, maxCount: 4, result: 1 },
    { index: 3, maxCount: 3, result: 0 },
    { index: -1, maxCount: 3, result: 2 },
    { index: -3, maxCount: 3, result: 0 },
  ])('%p', ({ index, maxCount, result }) => {
    expect(wrapToIndex(index, maxCount)).toBe(result);
  });

  it('throws when max is negative', () => {
    const index = 1;
    const maxCount = -1;
    const execute = () => wrapToIndex(index, maxCount);
    expect(execute).toThrow();
  });
});
/**** ><> ↑ --------- describe block for wrapToIndex -> This section is a top-level 'describe' block for the wrapToIndex function. It includes two 'it' blocks inside to test different aspects of wrapToIndex function. */
/**** ><> ↑ --------- it block inside describe block -> This part of the code tests that the wrapToIndex function throws an error when the second argument (maxCount) is negative. This block will be called when Jest runs this describe block. */
