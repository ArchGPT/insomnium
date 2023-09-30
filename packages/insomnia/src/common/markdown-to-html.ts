import dompurify from 'dompurify';
import { marked } from 'marked';
/**** ><> ↑ --------- Import statements ->  */

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false,
});
/**** ><> ↑ --------- Setting options for 'marked' library ->  */

export const markdownToHTML = (input: string) => dompurify.sanitize(marked.parse(input));
/**** ><> ↑ --------- Exporting a function that converts markdown to HTML ->  */
