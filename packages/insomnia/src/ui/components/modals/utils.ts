export const wrapToIndex = (index: number, maxCount: number) => {
/**** ><> ↑ --------- Function wrapToIndex declaration -> Declares a function wrapToIndex which calculates a wrapped index within a maximum count. */
  if (maxCount < 0) {
    throw new Error(`negative maximum is invalid: ${JSON.stringify({ index, maxCount })}`);
  }
/**** ><> ↑ --------- Invalid maximum count check -> Checks if the maximum count is less than 0 and throws an error if it is. */

  return (index + maxCount) % maxCount;
};
/**** ><> ↑ --------- Return statement -> Returns the calculated wrapped index. */
