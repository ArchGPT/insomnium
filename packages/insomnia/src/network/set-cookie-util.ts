import { cookiesFromJar, jarFromCookies } from '../common/cookies';
import { Cookie } from '../models/cookie-jar';
/**** ><> ↑ --------- Importing necessary modules and functions ->  */

export const addSetCookiesToToughCookieJar = async ({ setCookieStrings, currentUrl, cookieJar }: any) => {
  const rejectedCookies: string[] = [];
  const jar = jarFromCookies(cookieJar.cookies);
/**** ><> ↑ --------- Function `addSetCookiesToToughCookieJar` definition starts, initialize rejected cookies array and cookie jar ->  */
  for (const setCookieStr of setCookieStrings) {
    try {
      jar.setCookieSync(setCookieStr, currentUrl);
    } catch (err) {
      if (err instanceof Error) {
        rejectedCookies.push(err.message);
      }
    }
  }
/**** ><> ↑ --------- Iterate over setCookieStrings, try to set cookies to jar and catch potential errors ->  */
  const cookies = (await cookiesFromJar(jar)) as Cookie[];
  return { cookies, rejectedCookies };
};
/**** ><> ↑ --------- Get cookies from jar, returns cookies and rejectedCookies ->  */
