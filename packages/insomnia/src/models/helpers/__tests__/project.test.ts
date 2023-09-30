import { describe, expect, it } from '@jest/globals';

import { DEFAULT_PROJECT_ID } from '../../project';
import { sortProjects } from '../project';

/**** ><> ↑ --------- Import statements ->  */
const defaultProject = { name: 'a', remoteId: null, _id: DEFAULT_PROJECT_ID };

/**** ><> ↑ --------- Initialization of default project ->  */
const localA = { name: 'a', remoteId: null, _id: 'localA' };
const localB = { name: 'b', remoteId: null, _id: 'localB' };

/**** ><> ↑ --------- Initialization of local projects ->  */
const remoteA = { name: 'a', remoteId: 'notNull', _id: 'remoteA' };
const remoteB = { name: 'b', remoteId: 'notNull', _id: 'remoteB' };
const remote0 = { name: '0', remoteId: 'notNull', _id: 'remote0' };

/**** ><> ↑ --------- Initialization of remote projects ->  */
describe('sortProjects', () => {
  it('sorts projects by default > local > remote > name', () => {
    const unSortedProjects = [
      remoteA,
      localB,
      defaultProject,
      remoteB,
      localA,
      remote0,
    ];
    const result = sortProjects(unSortedProjects);

    const sortedProjects = [
/**** ><> ↑ --------- Sorting of unsorted projects ->  */
      defaultProject,
      localA,
      localB,
      remote0,
      remoteA,
      remoteB,
    ];
/**** ><> ↑ --------- Sorted project initialization ->  */
    expect(result).toEqual(sortedProjects);
/**** ><> ↑ --------- Description block containing test cases ->  */
  });
});
/**** ><> ↑ --------- Assertion ->  */
