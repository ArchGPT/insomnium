import { useCallback } from 'react';
import { useMountedState } from 'react-use';
/**** ><> ↑ --------- Importing necessary packages and hooks ->  */

export const useSafeReducerDispatch = <A>(dispatch: (action: A) => void) => {
  const isMounted = useMountedState();

  const safeDispatch = useCallback<typeof dispatch>((...args) => {
    if (isMounted()) {
      dispatch(...args);
    }
  }, [dispatch, isMounted]);
/**** ><> ↑ --------- Defining safeDispatch function ->  */

  return safeDispatch;
};
/**** ><> ↑ --------- Defining useSafeReducerDispatch custom hook ->  */
/**** ><> ↑ --------- Returning safeDispatch function ->  */
