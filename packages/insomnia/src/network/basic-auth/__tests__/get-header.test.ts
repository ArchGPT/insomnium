import { beforeEach, describe, expect, it } from '@jest/globals';

import { globalBeforeEach } from '../../../__jest__/before-each';
import { getBasicAuthHeader } from '../get-header';

/**** ><> ↑ --------- Import statements ->  */
describe('getBasicAuthHeader()', () => {
  beforeEach(globalBeforeEach);

  it('succeed with username and password', () => {
    const header = getBasicAuthHeader('user', 'password');
    expect(header).toEqual({
      name: 'Authorization',
      value: 'Basic dXNlcjpwYXNzd29yZA==',
    });
  });
/**** ><> ↑ --------- Test case for success with username and password ->  */

  it('succeed with username and password using iso-8859-1 encoding', () => {
    const header = getBasicAuthHeader('user', 'password-é', 'latin1');
    expect(header).toEqual({
      name: 'Authorization',
      value: 'Basic dXNlcjpwYXNzd29yZC3p',
    });
  });
/**** ><> ↑ --------- Test case for success with username and password using iso-8859-1 encoding ->  */

  it('succeed with no username', () => {
    const header = getBasicAuthHeader(null, 'password');
    expect(header).toEqual({
      name: 'Authorization',
      value: 'Basic OnBhc3N3b3Jk',
    });
  });
/**** ><> ↑ --------- Test case for success with no username ->  */

  it('succeed with username and empty password', () => {
    const header = getBasicAuthHeader('user', '');
    expect(header).toEqual({
      name: 'Authorization',
      value: 'Basic dXNlcjo=',
    });
  });
/**** ><> ↑ --------- Test case for success with username and empty password ->  */

  it('succeed with username and null password', () => {
    const header = getBasicAuthHeader('user', null);
    expect(header).toEqual({
      name: 'Authorization',
      value: 'Basic dXNlcjo=',
    });
  });
});
/**** ><> ↑ --------- Main describe block ->  */
/**** ><> ↑ --------- Test case for success with username and null password ->  */
