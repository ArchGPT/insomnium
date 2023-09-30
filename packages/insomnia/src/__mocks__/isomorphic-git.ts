import { jest } from '@jest/globals';
import isomorphicGitOriginal from 'isomorphic-git';
/**** ><> ↑ --------- Importing modules ->  */

// eslint-disable-next-line filenames/match-exported
/**** ><> ↑ --------- Disabling eslint rule ->  */
const git = jest.requireActual('isomorphic-git') as typeof isomorphicGitOriginal;
const mock = jest.createMockFromModule('isomorphic-git') as typeof isomorphicGitOriginal;
/**** ><> ↑ --------- Creating and mocking git object ->  */

git.push = mock.push;
git.clone = mock.clone;
/**** ><> ↑ --------- Setting implementations ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
module.exports = git;
/**** ><> ↑ --------- Warning about export default and exporting module ->  */
