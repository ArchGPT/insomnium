import { jest } from '@jest/globals';
import { EventEmitter } from 'events';
import fs from 'fs';
import os from 'os';
import path from 'path';
/**** ><> ↑ --------- Import statements ->  */

const RANDOM_STRING = Math.random().toString().replace('.', '');
/**** ><> ↑ --------- Initialization of RANDOM_STRING ->  */

const remote = {
  app: {
    getPath(name) {
      const dir = path.join(os.tmpdir(), `insomnia-tests-${RANDOM_STRING}`, name);
      fs.mkdirSync(dir, { recursive: true });
      return dir;
    },

    getLocale() {
      return 'en-US';
    },

    exit: jest.fn(),
  },
  net: {
    request() {
      const req = new EventEmitter();

      // @ts-expect-error -- TSCONVERSION appears to be genuine
      req.end = function() {};

      return req;
    },
  },
  BrowserWindow: {
    getAllWindows() {
      return [];
    },

    getFocusedWindow() {
      return {
        getContentBounds() {
          return {
            width: 1900,
            height: 1060,
          };
        },
      };
    },
  },
  screen: {
    getPrimaryDisplay() {
      return {
        workAreaSize: {
          width: 1920,
          height: 1080,
        },
      };
    },
  },
};
/**** ><> ↑ --------- Definition of the remote object ->  */

const dialog = {
  showErrorBox: jest.fn(),
};
/**** ><> ↑ --------- Definition of the dialog object ->  */

const electron = {
  ...remote,
  remote,
  dialog,
  ipcMain: {
    on: jest.fn(),

    once() {},
  },
  ipcRenderer: {
    on: jest.fn(),
    removeAllListeners: jest.fn(),

    once() {},

    send: jest.fn(),
  },
  shell: {
    openExternal: jest.fn(),
  },
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(),
    clear: jest.fn(),
  },
};
/**** ><> ↑ --------- Definition of the electron object ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
/**** ><> ↑ --------- Comment warning ->  */
module.exports = electron;
/**** ><> ↑ --------- Export statement ->  */
