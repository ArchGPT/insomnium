import type { Operation } from './diff';
/**** ><> ↑ --------- Importing dependencies ->  */

export function patch(a: string, operations: Operation[]) {
/**** ><> ↑ --------- Function declaration ->  */
  let result = '';
/**** ><> ↑ --------- Initializations ->  */

  for (const op of operations) {
    if (op.type === 'COPY') {
      result += a.slice(op.start, op.start + op.len);
    } else if (op.type === 'INSERT') {
      result += op.content;
    }
  }
/**** ><> ↑ --------- Loop through operations ->  */

  return result;
/**** ><> ↑ --------- Return result ->  */
}
/**** ><> ↑ --------- End of function ->  */
