import { useCallback, useState } from 'react';
import { useMountedState } from 'react-use';
/**** ><> ↑ --------- Imports libraries ->  */

export const useSafeState = <S>(initialValue: S | (() => S)) => {
  const isMounted = useMountedState();

  const [state, _setState] = useState(initialValue);

  const setState = useCallback<typeof _setState>((...args) => {
/**** ><> ↑ --------- Defines the useSafeState function and sets up initial variables ->  */
    if (isMounted()) {
      _setState(...args);
    }
  }, [isMounted]);
/**** ><> ↑ --------- Implements a conditional state setter within the useCallback hook ->  */

  // This needs to happen to force a tuple return type
/**** ><> ↑ --------- Comment regarding type forcing ->  */
  const returnValue: [typeof state, typeof setState] = [state, setState];
/**** ><> ↑ --------- Forces tuple return type ->  */

  return returnValue;
};
/**** ><> ↑ --------- Returns state and setState ->  */
