interface StatObj {
  type: 'file' | 'dir' | 'symlink';
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs?: number;
}
/**** ><> ↑ --------- Interface Definition for StatObj ->  */

export default class Stat {
  type: 'file' | 'dir' | 'symlink';
  mode: number;
  size: number;
  ino: number;
  mtimeMs: number;
  ctimeMs: number;
  uid: 1;
  gid: 1;
  dev: 1;

/**** ><> ↑ --------- Class Definition for Stat starts ->  */
  constructor(stats: StatObj) {
    this.type = stats.type;
    this.mode = stats.mode;
    this.size = stats.size;
    this.ino = stats.ino;
    this.mtimeMs = stats.mtimeMs;
    this.ctimeMs = stats.ctimeMs || stats.mtimeMs;
    this.uid = 1;
    this.gid = 1;
    this.dev = 1;
  }
/**** ><> ↑ --------- Constructor for Class Stat ->  */

  isFile() {
    return this.type === 'file';
  }
/**** ><> ↑ --------- Method to check if Stat is a File ->  */

  isDirectory() {
    return this.type === 'dir';
  }
/**** ><> ↑ --------- Method to check if Stat is a Directory ->  */

  isSymbolicLink() {
    return this.type === 'symlink';
  }
/**** ><> ↑ --------- Method to check if Stat is a Symbolic Link ->  */
}
/**** ><> ↑ --------- End of Class Definition for Stat ->  */
