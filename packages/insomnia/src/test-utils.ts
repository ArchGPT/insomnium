import { Mock } from 'jest-mock';
/**** ><> ↑ --------- Importing external module ->  */

import { showAlert, showError, showModal, showPrompt } from './ui/components/modals';
/**** ><> ↑ --------- Importing local module ->  */

export const getAndClearShowPromptMockArgs = () => {
  const mockFn = showPrompt as Mock<typeof showPrompt>;
  const options = mockFn.mock.calls[0][0];
  mockFn.mockClear();
  return options;
};
/**** ><> ↑ --------- Function to get and clear showPrompt mock arguments ->  */

export const getAndClearShowAlertMockArgs = () => {
  const mockFn = showAlert as Mock<typeof showAlert>;
  const options = mockFn.mock.calls[0][0];
  mockFn.mockClear();
  return options;
};
/**** ><> ↑ --------- Function to get and clear showAlert mock arguments ->  */

export const getAndClearShowErrorMockArgs = () => {
  const mockFn = showError as Mock<typeof showError>;
  const options = mockFn.mock.calls[0][0];
  mockFn.mockClear();
  return options;
};
/**** ><> ↑ --------- Function to get and clear showError mock arguments ->  */

export const getAndClearShowModalMockArgs = () => {
  const mockFn = showModal as Mock<typeof showModal>;
  const args = mockFn.mock.calls[0][1];
  mockFn.mockClear();
  return args;
};
/**** ><> ↑ --------- Function to get and clear showModal mock arguments ->  */
