/** This is a client for isomorphic-git {@link https://isomorphic-git.org/docs/en/http} */
/**** ><> ↑ --------- Documentation comment ->  */
export const httpClient = {
  request: async (config: any) => {
    if (config.headers && !config.headers.Accept) {
      config.headers.Accept = '*/*';
    }
    // hosted-git-info was adding git+ to the beginning of the url which isn't supported by axios after 0.27.0
    const withoutGitPlus = config.url.replace(/^git\+/, '');
/**** ><> ↑ --------- Converting the URL to the correct format ->  */
    const response = await window.main.axiosRequest({
      url: withoutGitPlus,
      method: config.method,
      headers: config.headers,
      data: config.body,
      responseType: 'arraybuffer',
      maxRedirects: 10,
    });
/**** ><> ↑ --------- Making the request using the window.main.axiosRequest method ->  */
    return {
      url: config.url,
      method: config.method,
      headers: response.headers as Record<string, string>,
      body: [response.data],
      statusCode: response.status,
      statusMessage: response.statusText,
    };
/**** ><> ↑ --------- Declaration of an exported http client object ->  */
  },
};
/**** ><> ↑ --------- Returning the response of the request ->  */
