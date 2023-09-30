
import { useEffect, useRef } from 'react';
/**** ><> ↑ --------- Import statement ->  */
// https://github.com/imbhargav5/rooks/blob/main/src/hooks/useTimeoutWhen.ts
/**** ><> ↑ --------- URL for reference ->  */
/**
 * A setTimeout hook that calls a callback after a timeout duration
 * when a condition is true
 *
 * @param cb The callback to be invoked after timeout
 * @param timeoutDelayMs Amount of time in ms after which to invoke
 * @param when The condition which when true, sets the timeout
 */
/**** ><> ↑ --------- JSDoc for the useTimeoutWhen function ->  */
function useTimeoutWhen(
  callback_: () => void,
  timeoutDelayMs = 0,
  when = true
): void {
/**** ><> ↑ --------- Function signature for useTimeoutWhen ->  */
  const savedRefCallback = useRef<() => any>();
/**** ><> ↑ --------- Initialization of ref savedRefCallback ->  */

  useEffect(() => {
    savedRefCallback.current = callback_;
  });
/**** ><> ↑ --------- useEffect hook to keep the callback updated ->  */

  function callback() {
    savedRefCallback.current && savedRefCallback.current();
  }
/**** ><> ↑ --------- Definition of the callback function ->  */

  useEffect(() => {
    if (when) {
      if (typeof window !== 'undefined') {
        const timeout = window.setTimeout(callback, timeoutDelayMs);

        return () => {
          window.clearTimeout(timeout);
        };
      } else {
        console.warn('useTimeoutWhen: window is undefined.');
      }
    }
    return;
  }, [timeoutDelayMs, when]);
/**** ><> ↑ --------- useEffect hook to set the timeout ->  */
}

export { useTimeoutWhen };
/**** ><> ↑ --------- Export statement ->  */
