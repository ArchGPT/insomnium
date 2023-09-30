import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';
import { parse as urlParse } from 'url';

import { isDevelopment } from '../../common/constants';
import * as models from '../../models';
import { isUrlMatchedInNoProxyRule } from '../../network/is-url-matched-in-no-proxy-rule';
import { setDefaultProtocol } from '../../utils/url/protocol';
/**** ><> ↑ --------- Importing dependencies ->  */
export const axiosRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const settings = await models.settings.getOrCreate();
  const isHttps = config.url?.indexOf('https:') === 0;
  let proxyUrl: string | null = null;
/**** ><> ↑ --------- Checking if the URL starts with 'https' ->  */

  if (isHttps && settings.httpsProxy) {
    proxyUrl = settings.httpsProxy;
  } else if (settings.httpProxy) {
    proxyUrl = settings.httpProxy;
  }
/**** ><> ↑ --------- Determining the proxy URL ->  */

  const finalConfig: AxiosRequestConfig = {
    ...config,
    httpsAgent: new https.Agent({
      rejectUnauthorized: settings.validateSSL,
    }),
    // ignore HTTP_PROXY, HTTPS_PROXY, NO_PROXY environment variables
    proxy: false,
  };
/**** ><> ↑ --------- Creating the final axios request configuration ->  */
  // hack for http-client
  const isArrayBuffer = Array.isArray(config.data) && config.responseType === 'arraybuffer';
  if (isArrayBuffer) {
    finalConfig.data = Buffer.concat(config.data);
  }
/**** ><> ↑ --------- Special handling for arraybuffer data ->  */
  if (settings.proxyEnabled && proxyUrl && !isUrlMatchedInNoProxyRule(finalConfig.url, settings.noProxy)) {
    const { hostname, port } = urlParse(setDefaultProtocol(proxyUrl));

    if (hostname && port) {
      finalConfig.proxy = {
        host: hostname,
        port: parseInt(port, 10),
      };
    }
  }
/**** ><> ↑ --------- Updating the configuration if proxy is enabled ->  */
  // HACK: workaround for isomteric git needing 400 responses
  if (config.responseType === 'arraybuffer') {
    console.log('[git-sync] Overriding validateStatus to allow 400 responses');
    finalConfig.validateStatus = status => status < 500;
  }
/**** ><> ↑ --------- Handling 400 response status for arraybuffer data ->  */
  const response = await axios(finalConfig);
/**** ><> ↑ --------- Making the axios request ->  */

  if (isDevelopment()) {
    console.log('[axios] Response', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: !!response.data,
      config: {
        method: response.config.method,
        url: response.config.url,
        proxy: response.config.proxy,
        headers: response.config.headers,
      },
    });
  }
/**** ><> ↑ --------- Debug logging for development ->  */

  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data,
    config: {
      method: response.config.method,
      url: response.config.url,
      proxy: response.config.proxy,
/**** ><> ↑ --------- Defining the axiosRequest function ->  */
      headers: response.config.headers,
    },
  };
};
/**** ><> ↑ --------- Returning the response ->  */
