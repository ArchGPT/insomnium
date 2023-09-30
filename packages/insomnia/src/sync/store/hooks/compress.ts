import zlib from 'zlib';
/**** ><> ↑ --------- Importing zlib module ->  */

import type { HookFn } from '../index';
/**** ><> ↑ --------- Importing HookFn type ->  */

const read: HookFn = async function read(extension: string, value: Buffer) {
  if (extension) {
    return value;
  }

  return new Promise((resolve, reject) => {
    zlib.gunzip(value, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
/**** ><> ↑ --------- Defining 'read' function ->  */

const write: HookFn = async function read(extension: string, value: Buffer) {
  if (extension) {
    return value;
  }

  return new Promise((resolve, reject) => {
    zlib.gzip(value, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
/**** ><> ↑ --------- Defining 'write' function ->  */

export default {
  read,
  write,
};
/**** ><> ↑ --------- Exporting read and write functions ->  */
