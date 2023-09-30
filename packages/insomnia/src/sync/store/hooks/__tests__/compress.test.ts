import { describe, expect, it } from '@jest/globals';

import hook from '../compress';
/**** ><> ↑ --------- Imports required modules ->  */

describe('compress hook', () => {
  it('compresses non-extension keys', async () => {
    const compressed = await hook.write('', 'hello');
    const uncompressed = await hook.read('', compressed);
    expect(uncompressed.toString()).toBe('hello');
  });

  it('writes raw data for extensions', async () => {
    const compressed = await hook.write('.json', 'hello');
    expect(compressed.toString('base64')).toBe('hello');
  });
/**** ><> ↑ --------- Test case to check raw data write for extensions ->  */

  it('reads compressed data', async () => {
    const data = Buffer.from('hello', 'utf8');
    const compressed = await hook.read('.json', data);
    expect(compressed.toString('utf8')).toBe('hello');
  });
});
/**** ><> ↑ --------- Defines a 'compress hook' test block ->  */
/**** ><> ↑ --------- Test case to read compressed data ->  */
