import type { CurlRequestOptions, CurlRequestOutput } from '../main/network/libcurl-promise';
const cancelRequestFunctionMap = new Map<string, () => void>();
/**** ><> ↑ --------- Imports and global variable declaration ->  */
export async function cancelRequestById(requestId: string) {
  const cancel = cancelRequestFunctionMap.get(requestId);
  if (cancel) {
    return cancel();
  }
  console.log(`[network] Failed to cancel req=${requestId} because cancel function not found`);
}
/**** ><> ↑ --------- Function to cancel request by id ->  */
export const cancellableCurlRequest = async (requestOptions: CurlRequestOptions) => {
  const requestId = requestOptions.requestId;
  const controller = new AbortController();
  const cancelRequest = () => {
    window.main.cancelCurlRequest(requestId);
    controller.abort();
  };
  cancelRequestFunctionMap.set(requestId, cancelRequest);
  try {
    const result = await cancellablePromise({ signal: controller.signal, fn: window.main.curlRequest(requestOptions) });
    return result as CurlRequestOutput;
  } catch (err) {
    cancelRequestFunctionMap.delete(requestId);
    if (err.name === 'AbortError') {
      return { statusMessage: 'Cancelled', error: 'Request was cancelled' };
    }
    console.log('[network] Error', err);
    return { statusMessage: 'Error', error: err.message || 'Something went wrong' };
  }
};
/**** ><> ↑ --------- Function to create a cancellable curl request ->  */
const cancellablePromise = ({ signal, fn }: { signal: AbortSignal; fn: Promise<any> }) => {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return new Promise((resolve, reject) => {
    const abortHandler = () => {
      reject(new DOMException('Aborted', 'AbortError'));
    };
    fn.then(res => {
      resolve(res);
      signal?.removeEventListener('abort', abortHandler);
    }, reject);
    signal?.addEventListener('abort', abortHandler);
  });
};
/**** ><> ↑ --------- Function to create a cancellable promise ->  */
