import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import path from 'path';

import { convertToOsSep, convertToPosixSep } from '../path-sep';

jest.mock('path');
/**** ><> ↑ --------- Import section - Loading necessary modules ->  */

describe('convertToPosixSep()', () => {
  it('should handle empty string', () => {
    expect(convertToPosixSep('')).toBe('');
  });

  it.each(['win32', 'posix'])('should convert separator from %s to posix', type => {
    const input = path[type].join('a', 'b', 'c');
    const posix = path.posix.join('a', 'b', 'c');
    expect(convertToPosixSep(input)).toBe(posix);
  });
});
/**** ><> ↑ --------- Test block 1 for conversion to POSIX separators ->  */

describe.each(['win32', 'posix'])('convertToOsSep() where os is %s', osType => {
  beforeAll(() => path.__mockPath(osType));

  afterAll(() => jest.restoreAllMocks());

  it.each(['win32', 'posix'])(`should convert separators from %s to ${osType}`, inputType => {
    const input = path[inputType].join('a', 'b', 'c');
    const output = path[osType].join('a', 'b', 'c');
    expect(convertToOsSep(input)).toBe(output);
  });
});
/**** ><> ↑ --------- Test block 2 for conversion to OS specific separators ->  */
