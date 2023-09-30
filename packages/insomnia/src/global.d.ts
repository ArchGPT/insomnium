/// <reference types="vite/client" />
import type { MainBridgeAPI } from './main/ipc/main';
/**** ><> ↑ --------- Importing types ->  */

declare global {
  interface Window {
    main: MainBridgeAPI;
    dialog: Pick<Electron.Dialog, 'showOpenDialog' | 'showSaveDialog'>;
    app: Pick<Electron.App, 'getPath' | 'getAppPath'>;
    shell: Pick<Electron.Shell, 'showItemInFolder'>;
    clipboard: Pick<Electron.Clipboard, 'readText' | 'writeText' | 'clear'>;
  }
}
/**** ><> ↑ --------- Declaring global types for Electron APIs ->  */

declare const __DEV__: boolean;
/**** ><> ↑ --------- Declaring __DEV__ type ->  */

declare namespace NodeJS {
  interface Global {
    __DEV__: boolean;
    /** this is required by codemirror/addon/lint/yaml-lint */
    jsyaml: any;
  }
}
/**** ><> ↑ --------- Declaring global types for NodeJS ->  */
