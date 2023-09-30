import { spawn } from 'child_process';
import { app } from 'electron';
import path from 'path';
/**** ><> ↑ --------- Module imports ->  */

function run(args: readonly string[] | undefined, done: (...args: any[]) => void) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  spawn(updateExe, args, {
    detached: true,
  }).on('close', done);
}
/**** ><> ↑ --------- Definition for function 'run' for spawning child process ->  */

export function checkIfRestartNeeded() {
  if (process.platform !== 'win32') {
    return false;
  }

/**** ><> ↑ --------- Definition for function 'checkIfRestartNeeded' ->  */
  const cmd = process.argv[1];
  console.log('processing squirrel command `%s`', cmd);
  const target = path.basename(process.execPath);

/**** ><> ↑ --------- Processing of the squirrel command ->  */
  switch (cmd) {
    case '--squirrel-install':
      run(['--createShortcut=' + target + ''], app.quit);
      return true;

    case '--squirrel-uninstall':
      run(['--removeShortcut=' + target + ''], app.quit);
      return true;

    case '--squirrel-updated':
    case '--squirrel-obsolete':
      app.quit();
      return true;

    default:
      return false;
  }
}
/**** ><> ↑ --------- Switch case conditions for different squirrel commands ->  */
