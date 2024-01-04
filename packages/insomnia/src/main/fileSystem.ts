import { autoUpdater, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import fs from 'fs';
import * as windowUtils from './window-utils';
import electron from 'electron';
import path from "path"

// pretty weird: over here, process.env['INSOMNIA_DATA_PATH'] is returning something in dev mode, when it should be null
// buy calling it inside init, and it returns null, as expected

export const init = async () => {

  const dataPath = electron.app.getPath('userData');

  let workSpacePath = path.join(dataPath, 'defaultCodebase', '.insomnium');

  console.log("process.env['INSOMNIA_DATA_PATH']", process.env['INSOMNIA_DATA_PATH'])
  console.log("workSpacePath_", workSpacePath);

  if (!fs.existsSync(workSpacePath)) {
    fs.mkdirSync(path.join(workSpacePath), { recursive: true })
  }

  // create a file FrontEnd.ts 
  if (!fs.existsSync(path.join(workSpacePath, 'frontEnd.ts'))) {
    fs.writeFileSync(path.join(workSpacePath, 'frontEnd.ts'), '');
  }



  ipcMain.on('watchFile', (event, viewId) => {
    console.log('watchFile ->', viewId);  // Should print 'some_unique_id'
    const filePath = path.join(workSpacePath, 'frontEnd.ts')
    const watcher = fs.watch(filePath, (eventType, filename) => {
      if (eventType === 'change') {

        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) throw err;
          console.log('File changed', data);
          const window = windowUtils.getOrCreateWindow();
          window.webContents.send('file-updated', data);
        })
      }
    });
    console.log('watcher', watcher);
    // stop watching the file
    // watcher.close();
  });


}


export const saveRequestToFile = async ()=>{
  
}
