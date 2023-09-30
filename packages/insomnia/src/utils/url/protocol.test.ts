import { describe, expect, it } from '@jest/globals';

import { setDefaultProtocol } from './protocol';
/**** ><> ↑ --------- Import Statements ->  */

describe('setDefaultProtocol()', () => {
/**** ><> ↑ --------- Initialization of describe block ->  */
  it('no-ops on empty url', () => {
    const url = setDefaultProtocol('');
    expect(url).toBe('');
  });
/**** ><> ↑ --------- Test Case 1: No-ops on empty url ->  */

  it('correctly sets protocol for empty', () => {
    const url = setDefaultProtocol('google.com');
    expect(url).toBe('http://google.com');
  });
/**** ><> ↑ --------- Test Case 2: Correctly sets protocol for an empty protocol ->  */

  it('correctly sets protocol for padded domain', () => {
    const url = setDefaultProtocol('   google.com   ');
    expect(url).toBe('http://google.com');
  });
/**** ><> ↑ --------- Test Case 3: Correctly sets protocol for padded domain ->  */

  it('does not set for valid url', () => {
    const url = setDefaultProtocol('https://google.com');
    expect(url).toBe('https://google.com');
  });
/**** ><> ↑ --------- Test Case 4: Does not set protocol for valid https url ->  */

  it('does not set for valid url', () => {
    const url = setDefaultProtocol('http://google.com');
    expect(url).toBe('http://google.com');
  });
/**** ><> ↑ --------- Test Case 5: Does not set protocol for valid http url ->  */

  it('does not set for invalid url', () => {
    const url = setDefaultProtocol('httbad://google.com');
    expect(url).toBe('httbad://google.com');
  });
/**** ><> ↑ --------- Test Case 6: Does not set protocol for invalid url ->  */
});
/**** ><> ↑ --------- End of describe block ->  */
