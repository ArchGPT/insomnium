import { useEffect, useState } from 'react';
/**** ><> ↑ --------- Importing dependencies ->  */

export function useReadyState({ requestId, protocol }: { requestId: string; protocol: 'curl' | 'webSocket' }): boolean {
/**** ><> ↑ --------- Declaring hook useReadyState with parameters ->  */
  const [readyState, setReadyState] = useState<boolean>(false);
/**** ><> ↑ --------- State initialization ->  */

  // get readyState when requestId or protocol changes
  useEffect(() => {
    let isMounted = true;
    const fn = async () => {
      window.main[protocol].readyState.getCurrent({ requestId })
        .then((currentReadyState: boolean) => {
          isMounted && setReadyState(currentReadyState);
        });
    };
    fn();
    return () => {
      isMounted = false;
    };
  }, [protocol, requestId]);
/**** ><> ↑ --------- First useEffect definition - updates readyState when requestId or protocol changes ->  */
  // listen for readyState changes
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = window.main.on(`${protocol}.${requestId}.readyState`,
      (_, incomingReadyState: boolean) => {
        isMounted && setReadyState(incomingReadyState);
      });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [protocol, requestId]);
/**** ><> ↑ --------- Second useEffect definition - listen for readyState changes and updates readyState ->  */

  return readyState;
/**** ><> ↑ --------- Return statement ->  */
}
/**** ><> ↑ --------- End of function useReadyState ->  */
