import { beforeEach, describe, expect, it } from '@jest/globals';

import { globalBeforeEach } from '../../__jest__/before-each';
import { getModel, mustGetModel } from '../index';
import * as models from '../index';
/**** ><> ↑ --------- Import Statements ->  */

describe('index', () => {
  beforeEach(globalBeforeEach);
  describe('getModel()', () => {
    it('should get model if found', () => {
      expect(getModel(models.workspace.type)).not.toBeNull();
    });

    it('should return null if model not found', () => {
      expect(getModel('UNKNOWN')).toBeNull();
    });
/**** ><> ↑ --------- Test case for not finding model ->  */
/**** ><> ↑ --------- Test block for getModel function ->  */
  });

  describe('mustGetModel()', () => {
    it('should get model if found', () => {
      expect(mustGetModel(models.workspace.type)).not.toBeNull();
    });

    it('should return null if model not found', () => {
      const func = () => mustGetModel('UNKNOWN');

      expect(func).toThrowError('The model type UNKNOWN must exist but could not be found.');
    });
/**** ><> ↑ --------- describe block for index ->  */
  });
/**** ><> ↑ --------- Test block for mustGetModel function ->  */
});
/**** ><> ↑ --------- Test case for not finding model through mustGetModel and throwing error ->  */
