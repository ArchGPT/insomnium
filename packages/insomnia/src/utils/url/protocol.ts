/**
 * Set a default protocol for a URL
 * @param url URL to set protocol on
 * @param [defaultProto='http:'] default protocol
 */
/**** ><> ↑ --------- JSDoc comment for function ->  */
export const setDefaultProtocol = (url: string, defaultProto?: string) => {
/**** ><> ↑ --------- Function declaration and parameters ->  */
  const trimmedUrl = url.trim();
  defaultProto = defaultProto || 'http:';
/**** ><> ↑ --------- Variable initialization and default value assignment ->  */

  // If no url, don't bother returning anything
  if (!trimmedUrl) {
    return '';
  }
/**** ><> ↑ --------- Checking and handling empty url case ->  */

  // Default the proto if it doesn't exist
  if (trimmedUrl.indexOf('://') === -1) {
    return `${defaultProto}//${trimmedUrl}`;
  }
/**** ><> ↑ --------- Checking if protocol is present in url and appending default protocol if not ->  */

  return trimmedUrl;
/**** ><> ↑ --------- Returning the possibly modified url ->  */
};
/**** ><> ↑ --------- End of function ->  */
