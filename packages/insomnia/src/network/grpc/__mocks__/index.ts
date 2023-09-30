import { jest } from '@jest/globals';
/**** ><> ↑ --------- import dependencies ->  */

module.exports = {
  start: jest.fn(),
  sendMessage: jest.fn(),
  commit: jest.fn(),
  cancel: jest.fn(),
  cancelMultiple: jest.fn(),
};
/**** ><> ↑ --------- define the module object ->  */
