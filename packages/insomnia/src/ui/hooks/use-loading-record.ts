import { useCallback, useState } from 'react';
/**** ><> ↑ --------- Import necessary modules ->  */

export const useLoadingRecord = () => {
/**** ><> ↑ --------- start useLoadingRecord method ->  */
  const [loading, setLoading] = useState<Record<string, boolean>>({});
/**** ><> ↑ --------- Declare state variable ->  */

  const startLoading = useCallback((id: string) => {
    setLoading(prevState => ({ ...prevState, [id]: true }));
  }, []);
/**** ><> ↑ --------- Declare useCallback for starting loading ->  */

  const stopLoading = useCallback((id: string) => {
    setLoading(prevState => ({ ...prevState, [id]: false }));
  }, []);
/**** ><> ↑ --------- Declare useCallback for stopping loading ->  */

  const isLoading = useCallback((id: string) => Boolean(loading[id]), [loading]);
/**** ><> ↑ --------- Declare useCallback for checking if loading ->  */

  return { startLoading, stopLoading, isLoading };
/**** ><> ↑ --------- Return object from useLoadingRecord hook ->  */
};
/**** ><> ↑ --------- End of useLoadingRecord method ->  */
