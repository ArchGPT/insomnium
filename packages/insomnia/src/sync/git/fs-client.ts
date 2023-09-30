import fs from 'fs';
import path from 'path';
/**** ><> ↑ --------- Module imports ->  */

type FSWraps =
  | typeof fs.promises.readFile
  | typeof fs.promises.writeFile
  | typeof fs.promises.unlink
  | typeof fs.promises.readdir
  | typeof fs.promises.mkdir
  | typeof fs.promises.rmdir
  | typeof fs.promises.stat
  | typeof fs.promises.lstat
  | typeof fs.promises.readlink
  | typeof fs.promises.symlink;
/**** ><> ↑ --------- Type definitions ->  */

/** This is a client for isomorphic-git. {@link https://isomorphic-git.org/docs/en/fs} */
export const fsClient = (basePath: string) => {
  console.log(`[fsClient] Created in ${basePath}`);
  fs.mkdirSync(basePath, { recursive: true });
/**** ><> ↑ --------- Client creation function declaration ->  */

  const wrap = (fn: FSWraps) => async (filePath: string, ...args: any[]) => {
    const modifiedPath = path.join(basePath, path.normalize(filePath));
    // @ts-expect-error -- TSCONVERSION
    return fn(modifiedPath, ...args);
  };
/**** ><> ↑ --------- Path modification function ->  */

  return {
    promises: {
      readFile: wrap(fs.promises.readFile),
      writeFile: wrap(fs.promises.writeFile),
      unlink: wrap(fs.promises.unlink),
      readdir: wrap(fs.promises.readdir),
      mkdir: wrap(fs.promises.mkdir),
      rmdir: wrap(fs.promises.rmdir),
      stat: wrap(fs.promises.stat),
      lstat: wrap(fs.promises.lstat),
      readlink: wrap(fs.promises.readlink),
      symlink: wrap(fs.promises.symlink),
    },
  };
};
/**** ><> ↑ --------- Function returns ->  */
