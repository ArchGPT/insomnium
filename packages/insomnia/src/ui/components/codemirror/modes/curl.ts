import 'codemirror/addon/mode/simple';

import CodeMirror from 'codemirror';
/**** ><> ↑ --------- Import Statements */

/** regular key-value header tokens */
const keyValueHeaders = [
  {
    regex: /^(> )([^:]*:)(.*)$/,
    token: ['curl-prefix curl-out', 'curl-out', 'curl-out curl-value'],
  },
  {
    regex: /^(< )([^:]*:)(.*)$/,
    token: ['curl-prefix curl-in', 'curl-in', 'curl-in curl-value'],
  },
];
/**** ><> ↑ --------- KeyValue Headers Definition */

/**
 * @example POST /foo/bar HTTP/1.1
 */
const headerFields = [
  {
    regex: /^(> )([^:]+ .*)$/,
    token: ['curl-prefix curl-out curl-header', 'curl-out curl-header'],
  },
  {
    regex: /^(< )([^:]+ .*)$/,
    token: ['curl-prefix curl-in curl-header', 'curl-in curl-header'],
  },
];
/**** ><> ↑ --------- Header Fields Definition */

const data = [
  {
    regex: /^(\| )(.*)$/,
    token: ['curl-prefix curl-data', 'curl-data'],
  },
];
/**** ><> ↑ --------- Data Definition */

const informationalText = [
  {
    regex: /^(\* )(.*)$/,
    token: ['curl-prefix curl-comment', 'curl-comment'],
  },
];
/**** ><> ↑ --------- Informational Text Definition */

CodeMirror.defineSimpleMode('curl', {
  start: [
    ...keyValueHeaders,
    ...headerFields,
    ...data,
    ...informationalText,
  ],
  comment: [],
  meta: {},
});
/**** ><> ↑ --------- CodeMirror Mode Definition */
