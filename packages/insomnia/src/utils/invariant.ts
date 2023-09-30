// Throw an error if the condition fails
// > Not providing an inline default argument for message as the result is smaller
export function invariant(
  condition: any,
  // Can provide a string, or a function that returns a string for cases where
  // the message takes a fair amount of effort to compute
  message?: string | (() => string),
): asserts condition {
/**** ><> ↑ --------- Function declaration with comments ->  */
  if (condition) {
    return;
  }
/**** ><> ↑ --------- Function body: checking the condition ->  */
  // Condition not passed

  throw new Error(typeof message === 'function' ? message() : message);
}
/**** ><> ↑ --------- Function body: throwing an error ->  */
