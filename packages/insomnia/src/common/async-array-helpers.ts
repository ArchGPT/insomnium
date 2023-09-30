export const asyncFilter = async <T>(arr: T[], predicate: (value: T, index: number, arr: T[]) => Promise<boolean>) => {
/**** ><> ↑ --------- Function declaration with type definitions for asyncFilter function ->  */
  const results = await Promise.all(arr.map(predicate));
/**** ><> ↑ --------- Results variable creation with await Promise.all ->  */
  return arr.filter((_v, index) => results[index]);
/**** ><> ↑ --------- Return statement with array filter ->  */
};
/**** ><> ↑ --------- End of function declaration ->  */
