import { parse as urlParse } from 'url';
// import { v4 as uuid } from 'uuid';

const WILDCARD_CHARACTER = '*';
const WILDCARD_SUBSTITUTION = Math.random().toString().split('.')[1];
const WILDCARD_SUBSTITUTION_PATTERN = new RegExp(`${WILDCARD_SUBSTITUTION}`, 'g');

export default function certificateUrlParse(url: string, debug: boolean = false) {

  if (url.indexOf(WILDCARD_CHARACTER) === -1) {
    return urlParse(url);
  } else {
    const parsed = urlParse(url.replace(/\*/g, WILDCARD_SUBSTITUTION));
    if (debug) {
      console.log("parsed", parsed);
    };

    parsed.hostname = _reinstateWildcards(parsed.hostname);
    parsed.host = _reinstateWildcards(parsed.host);
    parsed.href = _reinstateWildcards(parsed.href);
    parsed.port = _reinstateWildcards(parsed.port);
    return parsed;
  }
}

function _reinstateWildcards(string: string): string;
function _reinstateWildcards(string: string | null): string | null;
function _reinstateWildcards(string: string | null) {
  if (string) {
    return string.replace(WILDCARD_SUBSTITUTION_PATTERN, WILDCARD_CHARACTER);
  } else {
    return string;
  }
}
