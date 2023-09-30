import CodeMirror from 'codemirror';
CodeMirror.defineMode('openapi', function() {
/**** ><> ↑ --------- library import and function definition */
  const cons = ['true', 'false', 'on', 'off', 'yes', 'no'];
  const keywordRegex = new RegExp('\\b((' + cons.join(')|(') + '))$', 'i');
/**** ><> ↑ --------- constant and keyword regex definition */
  return {
    token: function(stream, state) {
      const ch = stream.peek();
      const esc = state.escaped;
      state.escaped = false;
/**** ><> ↑ --------- token function beginning and initial variable definitions */

      /* comments */
      if (ch === '#' && (stream.pos === 0 || /\s/.test(stream.string.charAt(stream.pos - 1)))) {
        stream.skipToEnd();
        return 'comment';
      }
/**** ><> ↑ --------- handling of comments */

      if (stream.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/)) {
        return 'string';
      }
/**** ><> ↑ --------- string matching */

      if (state.literal && stream.indentation() > state.keyCol) {
        stream.skipToEnd();
        return 'string';
      } else if (state.literal) {
        state.literal = false;
      }
/**** ><> ↑ --------- literal string handling */

      if (stream.sol()) {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;

/**** ><> ↑ --------- state initialization at the start of a line */
        /* document start */
        if (stream.match(/---/)) {
          return 'def';
        }

        /* document end */
        if (stream.match(/\.\.\./)) {
          return 'def';
        }
/**** ><> ↑ --------- document start and end handling */

        /* array list item */
        if (stream.match(/\s*-\s+/)) {
          return 'meta';
        }
      }
/**** ><> ↑ --------- array list item handling */

      /* inline pairs/lists */
      if (stream.match(/^(\{|\}|\[|\])/)) {
        if (ch === '{') {
          state.inlinePairs++;
        } else if (ch === '}') {
          state.inlinePairs--;
        } else if (ch === '[') {
          state.inlineList++;
        } else {
          state.inlineList--;
        }

        return 'meta';
      }
/**** ><> ↑ --------- inline pairs/lists */

      /* list separator */
      if (state.inlineList > 0 && !esc && ch === ',') {
        stream.next();
        return 'meta';
      }

      /* pairs separator */
      if (state.inlinePairs > 0 && !esc && ch === ',') {
        state.keyCol = 0;
        state.pair = false;
        state.pairStart = false;
        stream.next();
        return 'meta';
      }
/**** ><> ↑ --------- list and pairs separator */

      /* start of value of a pair */
      if (state.pairStart) {
        /* block literals */
        if (stream.match(/^\s*(\||>)\s*/)) {
          state.literal = true;
          return 'meta';
        }

        /* references */
        if (stream.match(/^\s*(&|\*)[a-z0-9._-]+\b/i)) {
          return 'variable-2';
        }

        /* numbers */
        if (state.inlinePairs === 0 && stream.match(/^\s*-?[0-9.,]+\s?$/)) {
          return 'number';
        }

        if (state.inlinePairs > 0 && stream.match(/^\s*-?[0-9.,]+\s?(?=(,|}))/)) {
          return 'number';
        }

        /* keywords */
        if (stream.match(keywordRegex)) {
          return 'keyword';
        }
      }
/**** ><> ↑ --------- start of value of a pair */

      /* pairs (associative arrays) -> key */
      if (
        !state.pair &&
        stream.match(/^\s*(?:[,[\]{}&*!|>'"%@`][^\s'":]|[^,[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/)
      ) {
        state.pair = true;
        state.keyCol = stream.indentation();
        return 'atom';
      }

      if (state.pair && stream.match(/^:\s*/)) {
        state.pairStart = true;
        return 'meta';
      }
/**** ><> ↑ --------- handling pairs and keys */

      /* nothing found, continue */
      state.pairStart = false;
      state.escaped = ch === '\\';
      stream.next();
      return null;
/**** ><> ↑ --------- handling when no patterns found */
    },
    startState: function() {
      return {
        pair: false,
        pairStart: false,
        keyCol: 0,
        inlinePairs: 0,
        inlineList: 0,
        literal: false,
        escaped: false,
      };
    },
/**** ><> ↑ --------- startState function and initial state definition */
    lineComment: '#',
    fold: 'indent',
  };
/**** ><> ↑ --------- remaining function properties definition */
});
CodeMirror.defineMIME('text/x-openapi', 'openapi');
CodeMirror.defineMIME('text/openapi', 'openapi');
/**** ><> ↑ --------- function definition closure and MIME type definitions */
